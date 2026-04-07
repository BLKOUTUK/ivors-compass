import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getTableConfig, UNLOCK_CODE } from '../data/interviewPrompts'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export type InterviewPhase = 'round1' | 'locked' | 'round2' | 'complete'

interface InterviewState {
  messages: ChatMessage[]
  questionCount: number
  maxQuestions: number
  phase: InterviewPhase
  loading: boolean
  sending: boolean
  error: string | null
}

const IVOR_API = import.meta.env.VITE_IVOR_API_URL || 'https://ivor.blkoutuk.cloud'

export function useInterview(tableId: number) {
  const [state, setState] = useState<InterviewState>({
    messages: [],
    questionCount: 0,
    maxQuestions: 5,
    phase: 'round1',
    loading: true,
    sending: false,
    error: null,
  })

  const sessionIdRef = useRef<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const config = getTableConfig(tableId)

  // Fetch or create session
  useEffect(() => {
    if (tableId < 1 || tableId > 7 || !config) return

    let cancelled = false

    async function init() {
      // Try to fetch existing session
      const { data: existing } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('table_id', tableId)
        .single()

      if (cancelled) return

      if (existing) {
        sessionIdRef.current = existing.id
        setState(prev => ({
          ...prev,
          messages: (existing.messages as ChatMessage[]) || [],
          questionCount: existing.question_count,
          maxQuestions: existing.max_questions,
          phase: existing.phase as InterviewPhase,
          loading: false,
        }))
      } else {
        // Create new session
        const { data: created, error } = await supabase
          .from('interview_sessions')
          .insert({
            table_id: tableId,
            compass_prompt: config!.compassPrompt,
            messages: [],
            question_count: 0,
            max_questions: 5,
            phase: 'round1',
          })
          .select()
          .single()

        if (cancelled) return

        if (error) {
          // Another phone may have just created it — try fetching again
          const { data: retry } = await supabase
            .from('interview_sessions')
            .select('*')
            .eq('table_id', tableId)
            .single()

          if (retry) {
            sessionIdRef.current = retry.id
            setState(prev => ({
              ...prev,
              messages: (retry.messages as ChatMessage[]) || [],
              questionCount: retry.question_count,
              maxQuestions: retry.max_questions,
              phase: retry.phase as InterviewPhase,
              loading: false,
            }))
            return
          }

          setState(prev => ({ ...prev, error: 'Could not start session', loading: false }))
          return
        }

        sessionIdRef.current = created.id
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    void init()
    return () => { cancelled = true }
  }, [tableId, config])

  // Subscribe to Realtime updates
  useEffect(() => {
    if (!sessionIdRef.current) return

    const channel = supabase
      .channel(`interview-${tableId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'interview_sessions',
          filter: `table_id=eq.${tableId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          setState(prev => ({
            ...prev,
            messages: (row.messages as ChatMessage[]) || [],
            questionCount: row.question_count as number,
            maxQuestions: row.max_questions as number,
            phase: row.phase as InterviewPhase,
          }))
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [tableId, state.loading])

  // Send a question
  const sendQuestion = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || state.sending) return
    if (state.phase !== 'round1' && state.phase !== 'round2') return
    if (state.questionCount >= state.maxQuestions) return

    setState(prev => ({ ...prev, sending: true, error: null }))

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }

    // Optimistically show user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))

    try {
      // Call ivor-core interview endpoint
      const res = await fetch(`${IVOR_API}/api/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          message: trimmed,
          sessionMessages: state.messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error('Interview API error')

      const { response } = await res.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }

      const newMessages = [...state.messages, userMessage, assistantMessage]
      const newCount = state.questionCount + 1

      // Determine new phase
      let newPhase: InterviewPhase = state.phase
      if (state.phase === 'round1' && newCount >= 5) {
        newPhase = 'locked' as InterviewPhase
      } else if (state.phase === 'round2' && newCount >= 8) {
        newPhase = 'complete' as InterviewPhase
      }

      // Concurrency guard: re-check count before writing
      const { data: current } = await supabase
        .from('interview_sessions')
        .select('question_count')
        .eq('table_id', tableId)
        .single()

      if (current && current.question_count !== state.questionCount) {
        // Someone else asked a question — resync
        setState(prev => ({ ...prev, sending: false, error: 'Someone at your table just asked a question. Refreshing...' }))
        const { data: fresh } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('table_id', tableId)
          .single()
        if (fresh) {
          setState(prev => ({
            ...prev,
            messages: (fresh.messages as ChatMessage[]) || [],
            questionCount: fresh.question_count,
            phase: fresh.phase as InterviewPhase,
            sending: false,
          }))
        }
        return
      }

      // Write to Supabase
      await supabase
        .from('interview_sessions')
        .update({
          messages: newMessages,
          question_count: newCount,
          phase: newPhase,
          updated_at: new Date().toISOString(),
        })
        .eq('table_id', tableId)

      setState(prev => ({
        ...prev,
        messages: newMessages,
        questionCount: newCount,
        phase: newPhase as InterviewPhase,
        sending: false,
      }))
    } catch {
      setState(prev => ({
        ...prev,
        // Remove optimistic user message on error
        messages: prev.messages.filter(m => m !== userMessage),
        sending: false,
        error: 'Could not reach the archive. Try again.',
      }))
    }
  }, [tableId, state])

  // Unlock code submission
  const submitUnlockCode = useCallback(async (code: string) => {
    if (code.trim().toUpperCase() !== UNLOCK_CODE) {
      setState(prev => ({ ...prev, error: 'Incorrect code' }))
      return false
    }

    const systemMessage: ChatMessage = {
      role: 'system',
      content: '3 more questions unlocked. This time — ask about what\'s missing.',
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...state.messages, systemMessage]

    await supabase
      .from('interview_sessions')
      .update({
        phase: 'round2',
        max_questions: 8,
        messages: newMessages,
        updated_at: new Date().toISOString(),
      })
      .eq('table_id', tableId)

    setState(prev => ({
      ...prev,
      phase: 'round2',
      maxQuestions: 8,
      messages: newMessages,
      error: null,
    }))

    return true
  }, [tableId, state.messages])

  return {
    ...state,
    config,
    sendQuestion,
    submitUnlockCode,
    questionsRemaining: state.maxQuestions - state.questionCount,
  }
}
