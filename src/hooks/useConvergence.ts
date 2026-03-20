import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useCompass } from './useCompass'

// ---------- types ----------

export interface DailyConvergence {
  id: string
  date: string
  affirmation: string
  phase: string | null
}

export interface Whisper {
  id: string
  daily_id: string
  whisper_text: string
  resonance_count: number
  created_at: string
  /** true when this whisper belongs to the current user */
  isMine: boolean
}

interface ConvergenceState {
  daily: DailyConvergence | null
  whispers: Whisper[]
  hasContributed: boolean
  totalCount: number
  loading: boolean
  submitting: boolean
  error: string | null
  codeId: string | null
}

// ---------- localStorage helpers ----------

const CODE_ID_KEY = 'ivors-compass-code-id'

function getStoredCodeId(): string | null {
  try {
    return localStorage.getItem(CODE_ID_KEY)
  } catch {
    return null
  }
}

function storeCodeId(id: string): void {
  try {
    localStorage.setItem(CODE_ID_KEY, id)
  } catch {
    // Private browsing -- works in memory
  }
}

// ---------- hook ----------

export function useConvergence() {
  const { accessCode } = useCompass()

  const [state, setState] = useState<ConvergenceState>({
    daily: null,
    whispers: [],
    hasContributed: false,
    totalCount: 0,
    loading: true,
    submitting: false,
    error: null,
    codeId: getStoredCodeId(),
  })

  // Resolve the access-code string to its UUID (code_id) in Supabase.
  // We cache the result in localStorage so this only happens once.
  const resolveCodeId = useCallback(async (): Promise<string | null> => {
    const cached = getStoredCodeId()
    if (cached) return cached

    if (!accessCode) return null

    try {
      const { data } = await supabase
        .from('compass_access_codes')
        .select('id')
        .eq('code', accessCode.toUpperCase().trim())
        .single()

      if (data?.id) {
        storeCodeId(data.id)
        return data.id as string
      }
    } catch {
      // Supabase not available -- fall through
    }

    return null
  }, [accessCode])

  // Load today's convergence + whispers
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      // 1. Resolve code_id
      const codeId = await resolveCodeId()

      // 2. Get or create today's affirmation via RPC
      const { data: dailyData, error: dailyErr } = await supabase.rpc(
        'get_todays_convergence',
      )

      if (dailyErr) throw dailyErr
      const daily = dailyData as DailyConvergence

      // 3. Fetch all whispers for today
      const { data: whisperRows, error: whisperErr } = await supabase
        .from('compass_whispers')
        .select('id, daily_id, whisper_text, resonance_count, created_at, code_id')
        .eq('daily_id', daily.id)
        .order('created_at', { ascending: true })

      if (whisperErr) throw whisperErr

      const rows = (whisperRows ?? []) as Array<{
        id: string
        daily_id: string
        whisper_text: string
        resonance_count: number
        created_at: string
        code_id: string | null
      }>

      const hasContributed = codeId
        ? rows.some((w) => w.code_id === codeId)
        : false

      // Strip code_id before exposing to the UI -- keep anonymity
      const whispers: Whisper[] = rows.map((w) => ({
        id: w.id,
        daily_id: w.daily_id,
        whisper_text: w.whisper_text,
        resonance_count: w.resonance_count,
        created_at: w.created_at,
        isMine: codeId ? w.code_id === codeId : false,
      }))

      setState({
        daily,
        whispers,
        hasContributed,
        totalCount: whispers.length,
        loading: false,
        submitting: false,
        error: null,
        codeId,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load today\u2019s convergence'
      setState((s) => ({ ...s, loading: false, error: message }))
    }
  }, [resolveCodeId])

  useEffect(() => {
    void load()
  }, [load])

  // Submit a whisper
  const submitWhisper = useCallback(
    async (text: string) => {
      if (!state.daily || !state.codeId) return
      const trimmed = text.trim()
      if (!trimmed || trimmed.length > 280) return

      setState((s) => ({ ...s, submitting: true, error: null }))

      try {
        const { error: insertErr } = await supabase
          .from('compass_whispers')
          .insert({
            daily_id: state.daily.id,
            code_id: state.codeId,
            whisper_text: trimmed,
          })

        if (insertErr) throw insertErr

        // Reload to get fresh list
        await load()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not share your whisper'
        setState((s) => ({ ...s, submitting: false, error: message }))
      }
    },
    [state.daily, state.codeId, load],
  )

  // Resonate with a whisper
  const resonate = useCallback(
    async (whisperId: string) => {
      if (!state.codeId) return

      try {
        const { data } = await supabase.rpc('add_resonance', {
          p_whisper_id: whisperId,
          p_code_id: state.codeId,
        })

        const result = data as { success: boolean; reason?: string } | null
        if (result?.success) {
          // Optimistic update
          setState((s) => ({
            ...s,
            whispers: s.whispers.map((w) =>
              w.id === whisperId
                ? { ...w, resonance_count: w.resonance_count + 1 }
                : w,
            ),
          }))
        }
      } catch {
        // Non-critical -- swallow
      }
    },
    [state.codeId],
  )

  return {
    ...state,
    submitWhisper,
    resonate,
    reload: load,
  }
}
