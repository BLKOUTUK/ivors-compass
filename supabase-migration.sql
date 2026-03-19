-- Ivor's Compass: Access Codes + Analytics
-- Run via scripts/supabase-query.mjs or Supabase dashboard

-- 1. Access codes table
CREATE TABLE IF NOT EXISTS compass_access_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_at TIMESTAMPTZ,
    device_fingerprint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Anonymous analytics (no PII)
CREATE TABLE IF NOT EXISTS compass_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id UUID REFERENCES compass_access_codes(id),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Generate 100 unique IVOR-XXXX codes
INSERT INTO compass_access_codes (code)
SELECT 'IVOR-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4))
FROM generate_series(1, 100)
ON CONFLICT (code) DO NOTHING;

-- Ensure we have exactly 100 (fill any collision gaps)
INSERT INTO compass_access_codes (code)
SELECT 'IVOR-' || upper(substr(md5(random()::text || clock_timestamp()::text || i::text), 1, 4))
FROM generate_series(1, 20) AS i
WHERE (SELECT count(*) FROM compass_access_codes) < 100
ON CONFLICT (code) DO NOTHING;

-- 4. RPC for code validation
CREATE OR REPLACE FUNCTION validate_compass_code(p_code TEXT)
RETURNS JSON AS $$
DECLARE
    code_record compass_access_codes%ROWTYPE;
BEGIN
    SELECT * INTO code_record
    FROM compass_access_codes
    WHERE code = upper(trim(p_code));

    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'reason', 'Code not found');
    END IF;

    IF code_record.is_redeemed THEN
        RETURN json_build_object('valid', true, 'returning', true);
    END IF;

    UPDATE compass_access_codes
    SET is_redeemed = true, redeemed_at = NOW()
    WHERE id = code_record.id;

    RETURN json_build_object('valid', true, 'returning', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RLS policies
ALTER TABLE compass_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read for code validation (via RPC)
CREATE POLICY "Allow anon to validate codes"
ON compass_access_codes FOR SELECT
TO anon
USING (true);

-- Allow anon to update redeemed status
CREATE POLICY "Allow anon to redeem codes"
ON compass_access_codes FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow anon to insert analytics
CREATE POLICY "Allow anon to log analytics"
ON compass_analytics FOR INSERT
TO anon
WITH CHECK (true);

-- 6. Index for fast code lookup
CREATE INDEX IF NOT EXISTS idx_compass_codes_code ON compass_access_codes(code);

-- 7. View for evaluation report
CREATE OR REPLACE VIEW compass_evaluation_stats AS
SELECT
    (SELECT count(*) FROM compass_access_codes) AS total_codes,
    (SELECT count(*) FROM compass_access_codes WHERE is_redeemed) AS codes_redeemed,
    (SELECT count(*) FROM compass_analytics WHERE event_type = 'meditation_read') AS meditations_read,
    (SELECT count(*) FROM compass_analytics WHERE event_type = 'card_drawn') AS cards_drawn,
    (SELECT count(*) FROM compass_analytics WHERE event_type = 'poem_played') AS poem_listens,
    (SELECT count(*) FROM compass_analytics WHERE event_type = 'film_watched') AS film_views,
    (SELECT count(*) FROM compass_analytics WHERE event_type = 'journal_entry') AS journal_entries;
