# Compass ops scripts

## day30-digest.mjs

Daily check: who in the BLKOUTHUB cohort hit day 30 since their claim?

**What it does**
1. Queries `compass_claims` for rows where `source='blkouthub'`, `feedback_due_at::date <= CURRENT_DATE`, and `feedback_sent_at IS NULL`.
2. If any rows found, POSTs a digest message to a Zapier webhook (the Zap then DMs Rob in Heartbeat).
3. Stamps `feedback_sent_at = NOW()` on those rows so they never resurface.

**If nothing is due, it exits cleanly with no notification.**

### Setup (one-off)

Two GitHub secrets needed on the `BLKOUTUK/ivors-compass` repo:

| Secret | Value |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Personal access token from https://supabase.com/dashboard/account/tokens (reuse the one already used elsewhere) |
| `ZAPIER_DAY30_WEBHOOK_URL` | The "Catch Hook" URL from a new Zapier zap (see below) |

### Zapier zap to build

1. Create new Zap in Zapier.
2. **Trigger:** Webhooks by Zapier → Catch Hook. Copy the webhook URL — that goes into `ZAPIER_DAY30_WEBHOOK_URL`.
3. **Action:** Heartbeat → Send Direct Message. Send to: yourself (Rob). Message body: use the `message` field from the incoming payload (Zapier exposes it as `{{message}}` or similar).
4. Turn on.

### Schedule

GitHub Actions cron at `0 9 * * *` (09:00 UTC daily). Trigger manually anytime via Actions → day30-digest → Run workflow.

### Dry run locally

```
DRY_RUN=1 \
SUPABASE_ACCESS_TOKEN=sbp_... \
node scripts/day30-digest.mjs
```

Prints the payload it would send; does not POST and does not stamp rows.

### Scope notes

- Currently scoped to `source='blkouthub'`. QC cohort handles its own 30-day cadence via SendFox.
- Gift recipients (`source='gift'`) are NOT included. If we want them in the digest later, the gifter's cohort decides (lineage via `gifted_by_claim_id`).
- The check-in DMs themselves stay personal — this script only tells Rob WHO to message, not what to say.
