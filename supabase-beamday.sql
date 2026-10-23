-- Ivor's Compass: Beam Day cohort (print journal, 28 Dec 2026)
-- The journal's QR goes to /claim?ref=beamday. Claims draw from a reserved pool of 100
-- BD- codes, and each claimant gets 3 gift codes, as the book promises.
-- Same shape as supabase-blkouthub-gift.sql; the only changes to claim_compass_code are
-- the three 'beamday' lines. Applied 23 Oct 2026.

CREATE OR REPLACE FUNCTION public.claim_compass_code(p_first_name text, p_email text, p_postcode text, p_source text DEFAULT 'landing'::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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

    SELECT cc.id, cc.first_name, ac.code INTO v_existing
    FROM compass_claims cc
    JOIN compass_access_codes ac ON ac.id = cc.code_id
    WHERE cc.email = lower(trim(p_email))
    LIMIT 1;

    IF FOUND THEN
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

    SELECT id, code INTO v_code
    FROM compass_access_codes
    WHERE id NOT IN (SELECT code_id FROM compass_claims WHERE code_id IS NOT NULL)
      AND is_redeemed = false
      AND (
        CASE
          WHEN p_source = 'blkouthub' THEN reserved_source = 'blkouthub'
          WHEN p_source = 'queer-croydon' THEN reserved_source = 'queer-croydon'
          WHEN p_source = 'beamday' THEN reserved_source = 'beamday'
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
                WHEN p_source = 'beamday' THEN 'beamday_cohort_full'
                ELSE 'codes_exhausted'
            END
        );
    END IF;

    -- FIX: every claimant was promised a 30-day check-in, so start the clock for all sources.
    v_feedback_due := now() + interval '30 days';

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

    v_should_gift := p_source IN ('blkouthub', 'queer-croydon', 'beamday');

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
$function$;

-- 100 Beam Day codes, BD-XXXXXX (6 hex, the QC-/BH- pattern).
INSERT INTO compass_access_codes (code, reserved_source, is_redeemed)
SELECT DISTINCT c, 'beamday', false
FROM (
    SELECT 'BD-' || upper(substr(md5(random()::text || clock_timestamp()::text || g::text), 1, 6)) AS c
    FROM generate_series(1, 100) g
) x
WHERE NOT EXISTS (SELECT 1 FROM compass_access_codes a WHERE a.code = x.c);
