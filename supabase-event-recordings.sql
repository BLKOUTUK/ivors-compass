-- Ivor's Compass: extend existing soundscape_recordings for event pages
-- Run via supabase-query / MCP / dashboard. Idempotent.
--
-- Yesterday's /compass/record already uploads into `interview-panels` bucket
-- and inserts into `soundscape_recordings`. These new columns let the two new
-- event pages (/installation and /interview/feedback) share the same table
-- without forcing a separate schema.

ALTER TABLE soundscape_recordings
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Backfill existing rows so reports can filter cleanly
UPDATE soundscape_recordings
    SET category = 'panel'
    WHERE category IS NULL;

CREATE INDEX IF NOT EXISTS idx_soundscape_recordings_category
    ON soundscape_recordings(category);

-- Reporting view — counts + timing per category for the evaluation report
CREATE OR REPLACE VIEW soundscape_recordings_summary AS
SELECT
    COALESCE(category, 'panel') AS category,
    count(*)::int AS total,
    min(created_at) AS first_recorded,
    max(created_at) AS last_recorded,
    count(email) FILTER (WHERE email IS NOT NULL)::int AS with_email
FROM soundscape_recordings
GROUP BY category
ORDER BY total DESC;

GRANT SELECT ON soundscape_recordings_summary TO authenticated;
