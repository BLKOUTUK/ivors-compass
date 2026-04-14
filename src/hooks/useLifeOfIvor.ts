import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { COMIC_SCRIPT, type ComicBeat } from '../data/comicScript'
import { TABLE_CONFIGS } from '../data/interviewPrompts'

export interface ParticipantPanel {
  id: string
  table_id: number
  generated_image_url: string | null
  panel_photo_url: string | null
  caption: string | null
  speech_bubble: string | null
  scene_description: string | null
  created_at: string
}

export interface ChapterPage {
  beat: ComicBeat
  panel: ParticipantPanel | null
  config: (typeof TABLE_CONFIGS)[number] | null
}

export function useLifeOfIvor() {
  const [panels, setPanels] = useState<ParticipantPanel[]>([])
  const [workshopPhoto, setWorkshopPhoto] = useState<string | null>('/images/workshop/page-20.jpg')
  const [loading, setLoading] = useState(true)

  // Fetch all panels on mount
  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data } = await supabase
        .from('interview_panels')
        .select('id, table_id, generated_image_url, panel_photo_url, caption, speech_bubble, scene_description, created_at')
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (data) setPanels(data as ParticipantPanel[])
      setLoading(false)
    }

    void load()
    return () => { cancelled = true }
  }, [])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('life-of-ivor-panels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'interview_panels' },
        (payload) => {
          setPanels(prev => [payload.new as ParticipantPanel, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'interview_panels' },
        (payload) => {
          const updated = payload.new as ParticipantPanel
          setPanels(prev =>
            prev.map(p => (p.id === updated.id ? updated : p))
          )
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  // Build the chapter list: pair each beat with its participant panel (if any)
  const chapters: ChapterPage[] = COMIC_SCRIPT.map(beat => {
    let panel: ParticipantPanel | null = null

    if (beat.type === 'participant' && beat.tableId) {
      // Latest panel for this table that has a generated image
      const withImage = panels.find(
        p => p.table_id === beat.tableId && p.generated_image_url
      )
      // Fall back to latest panel for this table (image may still be generating)
      const latest = panels.find(p => p.table_id === beat.tableId)
      panel = withImage || latest || null
    }

    const config = beat.tableId
      ? TABLE_CONFIGS.find(t => t.tableId === beat.tableId) || null
      : null

    return { beat, panel, config }
  })

  const filledCount = chapters.filter(
    c => c.beat.type === 'participant' && c.panel?.generated_image_url
  ).length

  return {
    chapters,
    loading,
    filledCount,
    totalSlots: 7,
    workshopPhoto,
    setWorkshopPhoto,
  }
}
