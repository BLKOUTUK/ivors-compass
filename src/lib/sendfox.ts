// SendFox sync via public form URLs.
// Pattern lifted from apps/crm/app/api/community/join/route.ts:310 — no API key,
// the form URL itself is the credential. Set per-list URLs in Coolify env.

const CLAIM_FORM = import.meta.env.VITE_SENDFOX_COMPASS_CLAIM_URL as string | undefined
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

export async function syncClaimToSendFox(email: string, firstName: string, postcode: string) {
  if (!CLAIM_FORM) return
  await postForm(CLAIM_FORM, { email, first_name: firstName, postcode })
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
