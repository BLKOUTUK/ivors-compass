-- Daily Convergence: shared affirmation + anonymous whispers

-- The daily affirmation (rotates automatically)
CREATE TABLE IF NOT EXISTS compass_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    affirmation_text TEXT NOT NULL,
    phase TEXT, -- identity, connection, resistance, joy
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anonymous whispers (reflections)
CREATE TABLE IF NOT EXISTS compass_whispers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_id UUID REFERENCES compass_daily(id) ON DELETE CASCADE,
    code_id UUID REFERENCES compass_access_codes(id),
    whisper_text TEXT NOT NULL CHECK (char_length(whisper_text) <= 280),
    resonance_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resonance tracking (one per code per whisper)
CREATE TABLE IF NOT EXISTS compass_resonances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whisper_id UUID REFERENCES compass_whispers(id) ON DELETE CASCADE,
    code_id UUID REFERENCES compass_access_codes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(whisper_id, code_id)
);

-- RLS
ALTER TABLE compass_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_whispers ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_resonances ENABLE ROW LEVEL SECURITY;

-- Anyone can read daily affirmations
CREATE POLICY "anon_read_daily" ON compass_daily FOR SELECT TO anon USING (true);

-- Anyone can read whispers (they're anonymous)
CREATE POLICY "anon_read_whispers" ON compass_whispers FOR SELECT TO anon USING (true);

-- Anyone can insert whispers
CREATE POLICY "anon_insert_whispers" ON compass_whispers FOR INSERT TO anon WITH CHECK (true);

-- Anyone can read resonances
CREATE POLICY "anon_read_resonances" ON compass_resonances FOR SELECT TO anon USING (true);

-- Anyone can insert resonances
CREATE POLICY "anon_insert_resonances" ON compass_resonances FOR INSERT TO anon WITH CHECK (true);

-- Function to get or create today's affirmation
CREATE OR REPLACE FUNCTION get_todays_convergence()
RETURNS JSON AS $$
DECLARE
    today_record compass_daily%ROWTYPE;
    affirmations TEXT[] := ARRAY[
        'My Blackness is my strength; my queerness is my light. I am a descendant of kings and creators who lived unapologetically.',
        'I am worthy of authentic connection. I release the need to mask my truth to be loved. My community sees me and holds me.',
        'I do not have to work twice as hard to be worthy. My existence is enough. I choose peace in a world that demands my labor.',
        'My joy is my protest. I am entitled to pleasure and play. I celebrate the vibrant colours of my life today.',
        'I carry the strength of those who came before me. Their courage lives in my choices today.',
        'I am allowed to take up space. My voice matters. My presence is enough.',
        'Rest is not a reward. It is my right. Today I choose to honour my body and its limits.',
        'I am building something beautiful, even when I cannot see the full picture yet.',
        'My anger is valid. My grief is valid. My joy is valid. I do not need permission to feel.',
        'I am not alone in this. Somewhere, right now, another brother is carrying a similar weight. We hold each other up.'
    ];
    phases TEXT[] := ARRAY['identity','connection','resistance','joy','identity','resistance','resistance','joy','identity','connection'];
    day_index INT;
BEGIN
    SELECT * INTO today_record FROM compass_daily WHERE date = CURRENT_DATE;

    IF FOUND THEN
        RETURN json_build_object(
            'id', today_record.id,
            'date', today_record.date,
            'affirmation', today_record.affirmation_text,
            'phase', today_record.phase
        );
    END IF;

    -- Rotate through affirmations based on day of year
    day_index := (EXTRACT(DOY FROM CURRENT_DATE)::INT % array_length(affirmations, 1)) + 1;

    INSERT INTO compass_daily (date, affirmation_text, phase)
    VALUES (CURRENT_DATE, affirmations[day_index], phases[day_index])
    RETURNING * INTO today_record;

    RETURN json_build_object(
        'id', today_record.id,
        'date', today_record.date,
        'affirmation', today_record.affirmation_text,
        'phase', today_record.phase
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add resonance and increment counter
CREATE OR REPLACE FUNCTION add_resonance(p_whisper_id UUID, p_code_id UUID)
RETURNS JSON AS $$
BEGIN
    INSERT INTO compass_resonances (whisper_id, code_id) VALUES (p_whisper_id, p_code_id);
    UPDATE compass_whispers SET resonance_count = resonance_count + 1 WHERE id = p_whisper_id;
    RETURN json_build_object('success', true);
EXCEPTION WHEN unique_violation THEN
    RETURN json_build_object('success', false, 'reason', 'already resonated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
