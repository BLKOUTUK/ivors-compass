-- Ivor's Compass: event recordings schema
-- Run via supabase-query / MCP / dashboard. Idempotent.
--
-- Two kinds of recording, two tables, different trust models:
--
-- 1. soundscape_recordings (existing) — anonymous by design. Used by
--    /compass/record and /installation. Woven into an ambient audio layer.
--    Never carries identity fields. Adds just a `category` column so we can
--    separate "panel" and "installation" for reporting without polluting
--    the core row.
--
-- 2. compass_feedback_recordings (new) — used only by /interview/feedback.
--    Evaluation artefact for funder reporting. Optional first_name + email
--    so attendees who want to be attributed can be, but default is anon.

-- ─────────────────────────────────────────────────────────────
-- 1. Soundscape: add category column only
-- ─────────────────────────────────────────────────────────────
ALTER TABLE soundscape_recordings
    ADD COLUMN IF NOT EXISTS category TEXT;

UPDATE soundscape_recordings
    SET category = 'panel'
    WHERE category IS NULL;

CREATE INDEX IF NOT EXISTS idx_soundscape_recordings_category
    ON soundscape_recordings(category);

-- ─────────────────────────────────────────────────────────────
-- 2. Feedback: its own table, own RLS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compass_feedback_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audio_url TEXT NOT NULL,
    first_name TEXT,
    email TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compass_feedback_recordings_created
    ON compass_feedback_recordings(created_at DESC);

ALTER TABLE compass_feedback_recordings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_feedback" ON compass_feedback_recordings;
CREATE POLICY "anon_insert_feedback"
    ON compass_feedback_recordings
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 3. Reporting views
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW soundscape_recordings_summary AS
SELECT
    COALESCE(category, 'panel') AS category,
    count(*)::int AS total,
    min(created_at) AS first_recorded,
    max(created_at) AS last_recorded
FROM soundscape_recordings
GROUP BY category
ORDER BY total DESC;

CREATE OR REPLACE VIEW compass_feedback_recordings_summary AS
SELECT
    count(*)::int AS total_feedback,
    count(email) FILTER (WHERE email IS NOT NULL)::int AS with_email,
    count(first_name) FILTER (WHERE first_name IS NOT NULL)::int AS with_name,
    min(created_at) AS first_recorded,
    max(created_at) AS last_recorded
FROM compass_feedback_recordings;

GRANT SELECT ON soundscape_recordings_summary TO authenticated;
GRANT SELECT ON compass_feedback_recordings_summary TO authenticated;
