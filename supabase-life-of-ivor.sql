-- Life of Ivor — Graphic Novel support
-- Run via: SUPABASE_ACCESS_TOKEN=xxx node scripts/supabase-query.mjs apps/ivors-compass/supabase-life-of-ivor.sql

-- Store AI-generated comic panel URL (persisted from base64)
ALTER TABLE interview_panels ADD COLUMN IF NOT EXISTS generated_image_url TEXT;

-- Enable realtime for interview_panels (interview_sessions already has it)
ALTER PUBLICATION supabase_realtime ADD TABLE interview_panels;

-- Allow anon to update panels (needed to write generated_image_url after insert)
CREATE POLICY "anon_update_panels" ON interview_panels FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Soundscape recordings table
CREATE TABLE IF NOT EXISTS soundscape_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  panel_number INTEGER CHECK (panel_number BETWEEN 1 AND 7),
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE soundscape_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_soundscape" ON soundscape_recordings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_soundscape" ON soundscape_recordings FOR INSERT TO anon WITH CHECK (true);
