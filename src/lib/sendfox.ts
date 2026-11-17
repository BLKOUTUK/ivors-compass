// SendFox sync via public form URLs.
// Pattern lifted from apps/crm/app/api/community/join/route.ts:310 — no API key,
// the form URL itself is the credential. Set per-list URLs in Coolify env.

const CLAIM_FORM = import.meta.env.VITE_SENDFOX_COMPASS_CLAIMS_URL as string | undefined
const QC_PIONEER_FORM = import.meta.env.VITE_SENDFOX_COMPASS_QC_URL as string | undefined
const WAITLIST_FORM = import.meta.env.VITE_SENDFOX_COMPASS_WAITLIST_URL as string | undefined

async function postForm(url: string, fields: Record<string, string>) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) {
    if (v) body.append(k, v)
  }
  // Honeypot — SendFox forms include a hidden a_password field.
  // We send it empty to match the form shape; real bots fill it in.
  body.append('a_password', '')
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
  } catch (err) {
    console.warn('SendFox sync failed (non-blocking):', err)
  }
}

export async function syncClaimToSendFox(
  email: string,
  firstName: string,
  postcode: string,
  source = 'landing',
) {
  // BLKOUTHUB cohort is handled internally via Heartbeat — does NOT sync to SendFox.
  // Gift recipients also stay off SendFox; their feedback path follows whichever cohort
  // their gifter came from (handled outside this funnel).
  if (source === 'blkouthub' || source === 'gift') return

  // Route QC pioneer cohort to its own SendFox list if configured.
  if (source === 'queer-croydon' && QC_PIONEER_FORM) {
    await postForm(QC_PIONEER_FORM, { email, first_name: firstName, postcode, source })
    return
  }
  if (!CLAIM_FORM) return
  await postForm(CLAIM_FORM, { email, first_name: firstName, postcode, source })
}

export async function syncWaitlistToSendFox(
  email: string,
  firstName?: string,
  postcode?: string,
) {
  if (!WAITLIST_FORM) return
  await postForm(WAITLIST_FORM, {
    email,
    first_name: firstName ?? '',
    postcode: postcode ?? '',
  })
}

// BLKOUT's monthly letter (SendFox list 631882), through its public form 235473.
// Only ever called when someone has ticked the separate, unticked opt-in box.
const NEWSLETTER_FORM =
  (import.meta.env.VITE_SENDFOX_NEWSLETTER_URL as string | undefined) || 'https://sendfox.com/form/3zpwee/1wj276'

export async function syncNewsletterOptIn(email: string) {
  await postForm(NEWSLETTER_FORM, { email })
}
