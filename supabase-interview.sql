-- Ivor's Compass — Interview Challenge
-- Run via: node scripts/supabase-query.mjs < apps/ivors-compass/supabase-interview.sql

CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id INTEGER NOT NULL UNIQUE CHECK (table_id BETWEEN 1 AND 7),
  compass_prompt TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  question_count INTEGER DEFAULT 0,
  max_questions INTEGER DEFAULT 5,
  phase TEXT DEFAULT 'round1' CHECK (phase IN ('round1', 'locked', 'round2', 'complete')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anon can read, insert, and update sessions
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_sessions" ON interview_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_sessions" ON interview_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert_sessions" ON interview_sessions FOR INSERT TO anon WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE interview_sessions;

-- Panel capture (comic strip output)
CREATE TABLE IF NOT EXISTS interview_panels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id INTEGER NOT NULL,
  panel_photo_url TEXT,
  caption TEXT,
  speech_bubble TEXT,
  scene_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE interview_panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_panels" ON interview_panels FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_panels" ON interview_panels FOR INSERT TO anon WITH CHECK (true);

-- Evaluation responses (heritage learning + audio for soundscape)
CREATE TABLE IF NOT EXISTS interview_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id INTEGER NOT NULL,
  surprised_by TEXT,
  personal_connection TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_responses" ON interview_responses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_responses" ON interview_responses FOR INSERT TO anon WITH CHECK (true);

-- Storage bucket for panel photos + audio recordings
-- Create via Supabase dashboard:
--   Bucket name: interview-panels
--   Public: true
--   Allowed MIME types: image/*, audio/webm
