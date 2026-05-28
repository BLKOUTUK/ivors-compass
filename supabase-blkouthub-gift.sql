-- Ivor's Compass — BLKOUTHUB cohort + gift-3-codes mechanic
-- Ring 1 distribution (peer-first to BLKOUTHUB members)
-- Run via scripts/supabase-query.mjs after backup

-- ─────────────────────────────────────────────────────────────────────
-- 1. Schema additions
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE compass_access_codes
    ADD COLUMN IF NOT EXISTS gifted_by_claim_id UUID
        REFERENCES compass_claims(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS gifter_name TEXT;

CREATE INDEX IF NOT EXISTS idx_compass_access_codes_gifted_by
    ON compass_access_codes(gifted_by_claim_id)
    WHERE gifted_by_claim_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_compass_access_codes_reserved
    ON compass_access_codes(reserved_source)
    WHERE reserved_source IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Gift-code minting helper (used by claim RPC)
--    Generates 3 unique GIFT-XXXXXX codes attached to a parent claim.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION mint_gift_codes(
    p_claim_id UUID,
    p_gifter_name TEXT,
    p_count INT DEFAULT 3
) RETURNS TEXT[] AS $$
DECLARE
    v_codes TEXT[] := ARRAY[]::TEXT[];
    v_new_code TEXT;
    v_attempts INT;
BEGIN
    FOR i IN 1..p_count LOOP
        v_attempts := 0;
        LOOP
            -- 6 random hex chars; collisions are vanishingly rare but we retry to be safe
            v_new_code := 'GIFT-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

            BEGIN
                INSERT INTO compass_access_codes (
                    code, reserved_source, gifted_by_claim_id, gifter_name, is_redeemed
                ) VALUES (
                    v_new_code, 'gift', p_claim_id, p_gifter_name, false
                );
                v_codes := array_append(v_codes, v_new_code);
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                v_attempts := v_attempts + 1;
                IF v_attempts > 5 THEN
                    RAISE EXCEPTION 'Could not generate unique gift code after 5 attempts';
                END IF;
            END;
        END LOOP;
    END LOOP;

    RETURN v_codes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────────────
-- 3. Extend claim_compass_code:
--    - Route ?ref=blkouthub to reserved_source='blkouthub' pool
--    - Auto-mint 3 gift codes for blkouthub + queer-croydon cohorts
--    - Return gift_codes array in response
--    - Set 30-day feedback obligation for blkouthub too
-- ─────────────────────────────────────────────────────────────────────

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
    v_feedback_due TIMESTAMPTZ;
    v_claim_id UUID;
    v_gift_codes TEXT[] := ARRAY[]::TEXT[];
    v_should_gift BOOLEAN;
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

    -- Returning visitor: same email → return their existing code + any gift codes
    SELECT cc.id, cc.first_name, ac.code INTO v_existing
    FROM compass_claims cc
    JOIN compass_access_codes ac ON ac.id = cc.code_id
    WHERE cc.email = lower(trim(p_email))
    LIMIT 1;

    IF FOUND THEN
        -- Re-surface only unclaimed gift codes from this claim (claimed ones drop off the list)
        SELECT COALESCE(array_agg(ac.code ORDER BY ac.id), ARRAY[]::TEXT[])
        INTO v_gift_codes
        FROM compass_access_codes ac
        WHERE ac.gifted_by_claim_id = v_existing.id
          AND NOT EXISTS (
              SELECT 1 FROM compass_claims cc WHERE cc.code_id = ac.id
          );

        RETURN json_build_object(
            'ok', true,
            'code', v_existing.code,
            'returning', true,
            'first_name', v_existing.first_name,
            'gift_codes', v_gift_codes
        );
    END IF;

    v_postcode_area := upper(regexp_replace(trim(p_postcode), '^([A-Za-z]+).*$', '\1'));

    -- Route codes by reservation.
    -- blkouthub and queer-croydon sources draw from their reserved pools only.
    -- All other sources draw from unreserved (general) codes only.
    -- 'gift' source is handled by claim_gift_code (not this RPC).
    SELECT id, code INTO v_code
    FROM compass_access_codes
    WHERE id NOT IN (SELECT code_id FROM compass_claims WHERE code_id IS NOT NULL)
      AND is_redeemed = false
      AND (
        CASE
          WHEN p_source = 'blkouthub' THEN reserved_source = 'blkouthub'
          WHEN p_source = 'queer-croydon' THEN reserved_source = 'queer-croydon'
          ELSE reserved_source IS NULL
        END
      )
    ORDER BY created_at, id
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'ok', false,
            'exhausted', true,
            'reason', CASE
                WHEN p_source = 'blkouthub' THEN 'blkouthub_cohort_full'
                WHEN p_source = 'queer-croydon' THEN 'qc_cohort_full'
                ELSE 'codes_exhausted'
            END
        );
    END IF;

    -- 30-day feedback obligation for partner cohorts
    IF p_source IN ('blkouthub', 'queer-croydon') THEN
        v_feedback_due := now() + interval '30 days';
    END IF;

    INSERT INTO compass_claims (
        code_id, first_name, email, postcode, postcode_area, source, feedback_due_at
    ) VALUES (
        v_code.id,
        trim(p_first_name),
        lower(trim(p_email)),
        upper(trim(p_postcode)),
        v_postcode_area,
        p_source,
        v_feedback_due
    ) RETURNING id INTO v_claim_id;

    -- Mint 3 gift codes for cohorts that should propagate.
    -- v1: blkouthub + queer-croydon only. Landing source doesn't get gifts (those are launch-day attendees).
    -- v1: no chaining — gift recipients won't mint further codes (handled in claim_gift_code).
    v_should_gift := p_source IN ('blkouthub', 'queer-croydon');

    IF v_should_gift THEN
        v_gift_codes := mint_gift_codes(v_claim_id, trim(p_first_name), 3);
    END IF;

    RETURN json_build_object(
        'ok', true,
        'code', v_code.code,
        'returning', false,
        'first_name', trim(p_first_name),
        'gift_codes', v_gift_codes
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────────────
-- 4. claim_gift_code: redeem a GIFT-XXXXXX code passed peer-to-peer
--    - No pool selection: the code IS the answer
--    - Validates the code exists, is gift-type, not already claimed
--    - Returns gifter info for the recipient's framing
--    - v1: gift recipients do NOT mint further gift codes
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION claim_gift_code(
    p_code TEXT,
    p_first_name TEXT,
    p_email TEXT,
    p_postcode TEXT
) RETURNS JSON AS $$
DECLARE
    v_code RECORD;
    v_postcode_area TEXT;
    v_existing RECORD;
    v_clean_code TEXT;
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
    IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
        RETURN json_build_object('ok', false, 'reason', 'code_required');
    END IF;

    v_clean_code := upper(trim(p_code));

    -- Returning visitor: same email → return their existing code
    SELECT cc.first_name, ac.code, ac.gifter_name INTO v_existing
    FROM compass_claims cc
    JOIN compass_access_codes ac ON ac.id = cc.code_id
    WHERE cc.email = lower(trim(p_email))
    LIMIT 1;

    IF FOUND THEN
        RETURN json_build_object(
            'ok', true,
            'code', v_existing.code,
            'returning', true,
            'first_name', v_existing.first_name,
            'gifter_name', v_existing.gifter_name,
            'gift_codes', ARRAY[]::TEXT[]
        );
    END IF;

    -- Locate the gift code
    SELECT id, code, reserved_source, gifter_name, gifted_by_claim_id INTO v_code
    FROM compass_access_codes
    WHERE upper(code) = v_clean_code
      AND reserved_source = 'gift'
    FOR UPDATE
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN json_build_object('ok', false, 'reason', 'gift_code_not_found');
    END IF;

    -- Already claimed by someone else?
    IF EXISTS (SELECT 1 FROM compass_claims WHERE code_id = v_code.id) THEN
        RETURN json_build_object('ok', false, 'reason', 'gift_code_already_claimed');
    END IF;

    v_postcode_area := upper(regexp_replace(trim(p_postcode), '^([A-Za-z]+).*$', '\1'));

    INSERT INTO compass_claims (
        code_id, first_name, email, postcode, postcode_area, source
    ) VALUES (
        v_code.id,
        trim(p_first_name),
        lower(trim(p_email)),
        upper(trim(p_postcode)),
        v_postcode_area,
        'gift'
    );

    RETURN json_build_object(
        'ok', true,
        'code', v_code.code,
        'returning', false,
        'first_name', trim(p_first_name),
        'gifter_name', v_code.gifter_name,
        'gift_codes', ARRAY[]::TEXT[]
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION claim_gift_code(TEXT, TEXT, TEXT, TEXT) TO anon;

-- ─────────────────────────────────────────────────────────────────────
-- 5. Mint 200 BLKOUTHUB codes (BH-XXXXXX format)
-- ─────────────────────────────────────────────────────────────────────

DO $$
DECLARE
    v_inserted INT := 0;
    v_new_code TEXT;
    v_attempts INT;
BEGIN
    WHILE v_inserted < 200 LOOP
        v_attempts := 0;
        LOOP
            v_new_code := 'BH-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
            BEGIN
                INSERT INTO compass_access_codes (code, reserved_source, is_redeemed)
                VALUES (v_new_code, 'blkouthub', false);
                v_inserted := v_inserted + 1;
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                v_attempts := v_attempts + 1;
                IF v_attempts > 5 THEN
                    RAISE EXCEPTION 'Too many collisions minting BH codes';
                END IF;
            END;
        END LOOP;
    END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────────────
-- 6. Reporting helper: cohort & gift propagation
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW compass_cohort_summary AS
SELECT
    COALESCE(source, 'unknown') AS source,
    COUNT(*) AS claims,
    COUNT(*) FILTER (WHERE feedback_consent = true) AS consented,
    COUNT(*) FILTER (WHERE feedback_due_at IS NOT NULL) AS scheduled,
    COUNT(*) FILTER (WHERE feedback_sent_at IS NOT NULL) AS feedback_sent,
    COUNT(*) FILTER (WHERE feedback_due_at < NOW() AND feedback_sent_at IS NULL) AS overdue,
    MIN(claimed_at)::DATE AS first_claim,
    MAX(claimed_at)::DATE AS last_claim
FROM compass_claims
GROUP BY source
ORDER BY claims DESC;

GRANT SELECT ON compass_cohort_summary TO authenticated;
