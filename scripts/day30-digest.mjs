#!/usr/bin/env node
// Day 30 Compass digest: finds compass_claims that hit feedback_due_at and
// emails Rob a digest (via the Gmail API, using the same Google OAuth as gws),
// then stamps feedback_sent_at so rows do not surface again.
//
// Env vars required:
//   SUPABASE_PROJECT_REF   (default: bgjengudzfickgomjqmz)
//   SUPABASE_ACCESS_TOKEN  (Supabase management PAT)
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN  (Google OAuth, gmail.modify scope)
// Optional:
//   DIGEST_TO    (default: rob@blkoutuk.com)
//   DIGEST_FROM  (default: rob@blkoutuk.com)
//   DRY_RUN=1    (print the email instead of sending; skips Gmail + the stamp)
//
// Run: node scripts/day30-digest.mjs
// Exits 0 if nothing due. Exits 1 on real errors.

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'bgjengudzfickgomjqmz'
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const DRY_RUN = process.env.DRY_RUN === '1'
const TO = process.env.DIGEST_TO || 'rob@blkoutuk.com'
const FROM = process.env.DIGEST_FROM || 'rob@blkoutuk.com'
const G_ID = process.env.GMAIL_CLIENT_ID
const G_SECRET = process.env.GMAIL_CLIENT_SECRET
const G_REFRESH = process.env.GMAIL_REFRESH_TOKEN

if (!TOKEN) {
  console.error('SUPABASE_ACCESS_TOKEN missing.')
  process.exit(1)
}

async function sql(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function sendEmail(subject, body) {
  // Mint a fresh access token from the refresh token (same OAuth client as gws).
  const tok = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: G_ID,
      client_secret: G_SECRET,
      refresh_token: G_REFRESH,
      grant_type: 'refresh_token',
    }),
  })
  if (!tok.ok) throw new Error(`OAuth ${tok.status}: ${await tok.text()}`)
  const access = (await tok.json()).access_token

  const raw = [
    `From: ${FROM}`,
    `To: ${TO}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
  ].join('\r\n')
  const encoded = Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    }
  )
  if (!res.ok) throw new Error(`Gmail ${res.status}: ${await res.text()}`)
}

const due = await sql(`
  SELECT cc.id, cc.first_name, cc.email, cc.claimed_at::date AS claimed_on,
         cc.source, ac.code, ac.reserved_source
  FROM compass_claims cc
  JOIN compass_access_codes ac ON ac.id = cc.code_id
  WHERE cc.feedback_due_at::date <= CURRENT_DATE
    AND cc.feedback_sent_at IS NULL
    AND cc.feedback_consent = true
  ORDER BY cc.feedback_due_at;
`)

if (due.length === 0) {
  console.log('No Compass claimers due for a check-in today.')
  process.exit(0)
}

if (!DRY_RUN && (!G_ID || !G_SECRET || !G_REFRESH)) {
  console.error('Gmail OAuth env (GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN) missing.')
  process.exit(1)
}

const lines = due
  .map(
    (r) =>
      `- ${r.first_name} (${r.email}) - ${r.source} - claimed ${r.code} on ${r.claimed_on}`
  )
  .join('\n')

const body =
  `${due.length} Compass claimer${due.length === 1 ? '' : 's'} hit day 30 (promised a feedback check-in):\n\n` +
  lines +
  `\n\nSend each the check-in: Heartbeat DM for Hub members, email for everyone else. ` +
  `Ask how the journal is sitting with them. Replies are captured by ` +
  `scripts/ops/compass-feedback-replies.mjs, which logs landed_at + flags anything needing action.`

const subject = `Compass: ${due.length} claimer${due.length === 1 ? '' : 's'} due a day-30 check-in`

if (DRY_RUN) {
  console.log('--- DRY RUN ---')
  console.log(`To: ${TO}`)
  console.log(`Subject: ${subject}`)
  console.log('')
  console.log(body)
  process.exit(0)
}

await sendEmail(subject, body)

// Mark all rows as sent so we never re-notify
const ids = due.map((r) => `'${r.id}'`).join(',')
await sql(`
  UPDATE compass_claims
  SET feedback_sent_at = NOW()
  WHERE id IN (${ids});
`)

console.log(`Emailed ${TO}; stamped ${due.length} row${due.length === 1 ? '' : 's'} as sent.`)
