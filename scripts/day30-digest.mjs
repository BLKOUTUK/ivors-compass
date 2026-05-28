#!/usr/bin/env node
// Day 30 BLKOUTHUB digest: finds compass_claims that hit feedback_due_at,
// POSTs a digest message to Zapier (which DMs Rob in Heartbeat), and
// stamps feedback_sent_at so rows do not surface again.
//
// Env vars required:
//   SUPABASE_PROJECT_REF  (default: bgjengudzfickgomjqmz)
//   SUPABASE_ACCESS_TOKEN (Personal access token)
//   ZAPIER_DAY30_WEBHOOK_URL (Zapier "Catch Hook" URL that ends in a Heartbeat DM to Rob)
//
// Run: node scripts/day30-digest.mjs
// Exits 0 if nothing due. Exits 1 on real errors.

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'bgjengudzfickgomjqmz'
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const ZAPIER_URL = process.env.ZAPIER_DAY30_WEBHOOK_URL
const DRY_RUN = process.env.DRY_RUN === '1'

if (!TOKEN) {
  console.error('SUPABASE_ACCESS_TOKEN missing.')
  process.exit(1)
}
if (!ZAPIER_URL && !DRY_RUN) {
  console.error('ZAPIER_DAY30_WEBHOOK_URL missing (set DRY_RUN=1 to test without it).')
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

const due = await sql(`
  SELECT cc.id, cc.first_name, cc.email, cc.claimed_at::date AS claimed_on,
         ac.code, ac.reserved_source
  FROM compass_claims cc
  JOIN compass_access_codes ac ON ac.id = cc.code_id
  WHERE cc.source = 'blkouthub'
    AND cc.feedback_due_at::date <= CURRENT_DATE
    AND cc.feedback_sent_at IS NULL
  ORDER BY cc.feedback_due_at;
`)

if (due.length === 0) {
  console.log('No BLKOUTHUB claimers due today.')
  process.exit(0)
}

const lines = due
  .map(
    (r) =>
      `- ${r.first_name} (${r.email}) - claimed ${r.code} on ${r.claimed_on}`
  )
  .join('\n')

const message =
  `${due.length} BLKOUTHUB Compass claimer${due.length === 1 ? '' : 's'} hit day 30:\n\n` +
  lines +
  `\n\nSend each a quick check-in DM in Heartbeat. Ask how the journal is sitting with them. ` +
  `Anything they want to share back will shape Ring 2.`

const payload = {
  date: new Date().toISOString().slice(0, 10),
  cohort: 'blkouthub',
  count: due.length,
  message,
  claimants: due.map((r) => ({
    first_name: r.first_name,
    email: r.email,
    code: r.code,
    claimed_on: r.claimed_on,
  })),
}

if (DRY_RUN) {
  console.log('--- DRY RUN ---')
  console.log(JSON.stringify(payload, null, 2))
  process.exit(0)
}

const zres = await fetch(ZAPIER_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

if (!zres.ok) {
  const txt = await zres.text()
  throw new Error(`Zapier ${zres.status}: ${txt}`)
}

// Mark all rows as sent so we never re-notify
const ids = due.map((r) => `'${r.id}'`).join(',')
await sql(`
  UPDATE compass_claims
  SET feedback_sent_at = NOW()
  WHERE id IN (${ids});
`)

console.log(`Notified Rob via Zapier; stamped ${due.length} row${due.length === 1 ? '' : 's'} as sent.`)
