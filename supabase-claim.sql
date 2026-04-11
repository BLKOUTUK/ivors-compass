-- Ivor's Compass: Digital claim funnel
-- Replaces physical card distribution (cards didn't arrive in time for 12 Apr event)
-- Run via scripts/supabase-query.mjs

-- 1. Claims table — one row per allocated access code
CREATE TABLE IF NOT EXISTS compass_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id UUID UNIQUE REFERENCES compass_access_codes(id),
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    postcode TEXT NOT NULL,
    postcode_area TEXT,
    feedback_consent BOOLEAN NOT NULL DEFAULT true,
    source TEXT DEFAULT 'landing',
    claimed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compass_claims_email ON compass_claims(email);
CREATE INDEX IF NOT EXISTS idx_compass_claims_postcode_area ON compass_claims(postcode_area);

-- 2. Waitlist for Summer release (50% off digital, 20% off print journal)
CREATE TABLE IF NOT EXISTS compass_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    postcode TEXT,
    interest TEXT[] DEFAULT '{}',
    source TEXT DEFAULT 'opt_in',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compass_waitlist_source ON compass_waitlist(source);

-- 3. Atomic claim RPC — picks next free code, locks it, writes claim
CREATE OR REPLACE FUNCTION claim_compass_code(
    p_first_name TEXT,
    p_email TEXT,
    p_postcode TEXT,
    p_source TEXT DEFAULT 'landing'
) RETURNS JSON AS $$
DECLARE
    v_code RECORD;
    v_postcode_area TEXT;
    v_existing RECORD;
BEGIN
    IF p_first_name IS NULL OR length(trim(p_first_name)) = 0 THEN
        RETURN json_build_object('ok', false, 'reason', 'first_name_required');
    END IF;
    IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RETURN json_build_object('ok', false, 'reason', 'email_invalid');
    END IF;
    IF p_postcode IS NULL OR length(trim(p_postcode)) = 0 THEN
        RETURN json_build_object('ok', false, 'reason', 'postcode_required');
    END IF;

    -- Returning visitor: same email already claimed → return their code
    SELECT cc.first_name, ac.code INTO v_existing
    FROM compass_claims cc
    JOIN compass_access_codes ac ON ac.id = cc.code_id
    WHERE cc.email = lower(trim(p_email))
    LIMIT 1;

    IF FOUND THEN
        RETURN json_build_object(
            'ok', true,
            'code', v_existing.code,
            'returning', true,
            'first_name', v_existing.first_name
        );
    END IF;

    v_postcode_area := upper(regexp_replace(trim(p_postcode), '^([A-Za-z]+).*$', '\1'));

    -- Pick next unallocated code, atomically
    SELECT id, code INTO v_code
    FROM compass_access_codes
    WHERE id NOT IN (SELECT code_id FROM compass_claims WHERE code_id IS NOT NULL)
      AND is_redeemed = false
    ORDER BY created_at, id
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN json_build_object('ok', false, 'exhausted', true);
    END IF;

    INSERT INTO compass_claims (
        code_id, first_name, email, postcode, postcode_area, source
    ) VALUES (
        v_code.id,
        trim(p_first_name),
        lower(trim(p_email)),
        upper(trim(p_postcode)),
        v_postcode_area,
        p_source
    );

    RETURN json_build_object(
        'ok', true,
        'code', v_code.code,
        'returning', false,
        'first_name', trim(p_first_name)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Live remaining count for scarcity counter
CREATE OR REPLACE FUNCTION compass_codes_remaining()
RETURNS INT AS $$
    SELECT GREATEST(
        0,
        100 - (SELECT count(*)::int FROM compass_claims)
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5. Waitlist join RPC
CREATE OR REPLACE FUNCTION join_compass_waitlist(
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_postcode TEXT DEFAULT NULL,
    p_interest TEXT[] DEFAULT ARRAY['digital_50_off', 'print_20_off'],
    p_source TEXT DEFAULT 'opt_in'
) RETURNS JSON AS $$
BEGIN
    IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RETURN json_build_object('ok', false, 'reason', 'email_invalid');
    END IF;

    INSERT INTO compass_waitlist (email, first_name, postcode, interest, source)
    VALUES (lower(trim(p_email)), p_first_name, p_postcode, p_interest, p_source)
    ON CONFLICT (email) DO UPDATE SET
        first_name = COALESCE(EXCLUDED.first_name, compass_waitlist.first_name),
        postcode = COALESCE(EXCLUDED.postcode, compass_waitlist.postcode),
        interest = compass_waitlist.interest || EXCLUDED.interest;

    RETURN json_build_object('ok', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS — enable + grant anon execute on RPCs only (no direct table access)
ALTER TABLE compass_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_waitlist ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE policies for anon — all writes go through SECURITY DEFINER RPCs.
-- This prevents browser clients from reading the email list or enumerating claims.

GRANT EXECUTE ON FUNCTION claim_compass_code(TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION compass_codes_remaining() TO anon;
GRANT EXECUTE ON FUNCTION join_compass_waitlist(TEXT, TEXT, TEXT, TEXT[], TEXT) TO anon;

-- 7. Reporting view — aggregate claims by postcode area for funder evaluation
CREATE OR REPLACE VIEW compass_claims_by_area AS
SELECT
    postcode_area,
    CASE
        WHEN postcode_area = 'CR' THEN 'Croydon'
        WHEN postcode_area IN ('SE', 'SW') THEN 'Inner South London'
        WHEN postcode_area IN ('BR', 'SM', 'KT', 'TW') THEN 'Outer South London'
        ELSE 'Other / visitor'
    END AS region,
    count(*)::int AS claim_count,
    min(claimed_at) AS first_claim,
    max(claimed_at) AS last_claim
FROM compass_claims
GROUP BY postcode_area
ORDER BY claim_count DESC;

GRANT SELECT ON compass_claims_by_area TO authenticated;
