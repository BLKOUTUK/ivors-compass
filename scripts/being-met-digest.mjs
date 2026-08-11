#!/usr/bin/env node
// Being-met digest: emails Rob the unmet-gesture queue and open loops daily.
// The guarantee from the Course 2 spec (§8.2): no first gesture silently ages out.
// Unlike day30-digest there is NO "sent" stamp — a man stays in the email until
// somebody actually meets him (met_at) or a human classifies him (status).
//
// Env: same as day30-digest.mjs (Supabase PAT + Gmail OAuth). DRY_RUN=1 to print.
// Stamp a meeting: node scripts/ops/mark-met.mjs <email> "<name>"   (platform repo)

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

const unmet = await sql(
  `SELECT person_name, person_ref, surface, gesture, days_waiting, acknowledged, notes, returner
   FROM unmet_gestures ORDER BY surface, days_waiting DESC;`
)
const loops = await sql(
  `SELECT person_name, person_ref, gesture, met_on, days_since_met, notes
   FROM open_loops ORDER BY met_on;`
)

if (unmet.length === 0 && loops.length === 0) {
  console.log('Queue empty and no open loops. Nothing to send.')
  process.exit(0)
}

if (!DRY_RUN && (!G_ID || !G_SECRET || !G_REFRESH)) {
  console.error('Gmail OAuth env missing.')
  process.exit(1)
}

// Events signups are broadcast-first (briefings), personal-by-exception —
// summarised as a count unless someone has waited past the events window or
// carries a note (e.g. offered to help organise).
const EVENTS_SPOTLIGHT_DAYS = 30
const eventsRows = unmet.filter((r) => r.surface === 'events')
const eventsSpotlight = eventsRows.filter(
  (r) => r.notes || r.days_waiting > EVENTS_SPOTLIGHT_DAYS
)
const personal = unmet.filter((r) => r.surface !== 'events')

const fmt = (r) =>
  `- ${r.person_name || '?'} (${r.person_ref})${r.returner ? ' [returner]' : ''} — ${r.gesture} — waiting ${r.days_waiting}d` +
  (r.acknowledged ? '' : ' [no auto-receipt either]') +
  (r.notes ? `\n    note: ${r.notes}` : '')

let body = ''
if (personal.length) {
  body += `WAITING TO BE MET (${personal.length}):\n${personal.map(fmt).join('\n')}\n\n`
}
if (eventsRows.length) {
  body += `EVENT SIGNUPS NOT YET TOUCHED: ${eventsRows.length} (briefing/broadcast may be the right first touch)\n`
  if (eventsSpotlight.length) {
    body += `Of which needing eyes:\n${eventsSpotlight.map(fmt).join('\n')}\n`
  }
  body += '\n'
}
if (loops.length) {
  body += `OPEN LOOPS — met, no reply yet, note on file (${loops.length}):\n`
  body += loops
    .map(
      (r) =>
        `- ${r.person_name || '?'} (${r.person_ref}) — met ${r.met_on} (${r.days_since_met}d ago)\n    ${r.notes}`
    )
    .join('\n')
  body += '\n\n'
}
body +=
  `To stamp a meeting: node scripts/ops/mark-met.mjs <email> (platform repo), ` +
  `or reply capture will log it where wired. Spec: projects/membership/docs/build-spec-being-met-2026-08.md`

const subject = `Being met: ${personal.length} waiting · ${eventsRows.length} event signups · ${loops.length} open loops`

if (DRY_RUN) {
  console.log('--- DRY RUN ---')
  console.log(`To: ${TO}`)
  console.log(`Subject: ${subject}`)
  console.log('')
  console.log(body)
  process.exit(0)
}

await sendEmail(subject, body)
console.log(`Emailed ${TO}: ${subject}`)
