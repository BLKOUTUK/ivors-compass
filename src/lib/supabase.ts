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

export interface ClaimResult {
  ok: boolean
  code?: string
  returning?: boolean
  first_name?: string
  exhausted?: boolean
  reason?: string
}

export async function claimCompassCode(
  firstName: string,
  email: string,
  postcode: string,
  source = 'landing',
): Promise<ClaimResult> {
  const { data, error } = await supabase.rpc('claim_compass_code', {
    p_first_name: firstName.trim(),
    p_email: email.trim().toLowerCase(),
    p_postcode: postcode.trim().toUpperCase(),
    p_source: source,
  })

  if (error) {
    console.error('Claim error:', error)
    return { ok: false, reason: 'server_error' }
  }
  return data as ClaimResult
}

export async function compassCodesRemaining(): Promise<number> {
  const { data, error } = await supabase.rpc('compass_codes_remaining')
  if (error || typeof data !== 'number') return 100
  return data
}

export async function joinCompassWaitlist(
  email: string,
  firstName?: string,
  postcode?: string,
  interest: string[] = ['digital_50_off', 'print_20_off'],
  source = 'opt_in',
): Promise<{ ok: boolean; reason?: string }> {
  const { data, error } = await supabase.rpc('join_compass_waitlist', {
    p_email: email.trim().toLowerCase(),
    p_first_name: firstName?.trim() || null,
    p_postcode: postcode?.trim().toUpperCase() || null,
    p_interest: interest,
    p_source: source,
  })
  if (error) {
    console.error('Waitlist error:', error)
    return { ok: false, reason: 'server_error' }
  }
  return data as { ok: boolean; reason?: string }
}
