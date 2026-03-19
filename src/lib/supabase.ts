import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function validateAccessCode(code: string): Promise<{ valid: boolean; returning?: boolean }> {
  const cleaned = code.toUpperCase().trim()

  const { data, error } = await supabase.rpc('validate_compass_code', { p_code: cleaned })

  if (error) {
    console.error('Code validation error:', error)
    // Fallback: check directly if Supabase RPC not yet deployed
    const { data: row } = await supabase
      .from('compass_access_codes')
      .select('id, is_redeemed')
      .eq('code', cleaned)
      .single()

    if (!row) return { valid: false }

    if (!row.is_redeemed) {
      await supabase
        .from('compass_access_codes')
        .update({ is_redeemed: true, redeemed_at: new Date().toISOString() })
        .eq('id', row.id)
    }

    return { valid: true, returning: row.is_redeemed }
  }

  return data as { valid: boolean; returning?: boolean }
}

export async function logAnalytics(
  codeId: string | null,
  eventType: string,
  eventData?: Record<string, unknown>
) {
  try {
    await supabase.from('compass_analytics').insert({
      code_id: codeId,
      event_type: eventType,
      event_data: eventData || {},
    })
  } catch {
    // Analytics is non-critical — fail silently
  }
}
