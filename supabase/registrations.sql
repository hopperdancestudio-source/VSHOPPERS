-- ============================================================================
-- Student Registration Module Schema
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. registrations table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_no TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  dob DATE NOT NULL,
  age INTEGER NOT NULL,
  joining_date DATE NOT NULL,
  dance_style TEXT NOT NULL,
  batch_time TEXT NOT NULL,
  package TEXT NOT NULL,
  payment_mode TEXT NOT NULL,
  batch_days TEXT NOT NULL,
  emergency_contact TEXT,
  medical_condition TEXT,
  notes TEXT,
  internal_notes TEXT,
  agreement BOOLEAN NOT NULL CHECK (agreement = true),
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Paid')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Confirmed', 'Active', 'Completed', 'Cancelled')),
  viewed BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. registration_status_history (Audit Trail)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registration_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  changed_by TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_payment_status TEXT,
  new_payment_status TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. Dynamic year-based registration sequence trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_registration_no()
RETURNS TRIGGER AS $$
DECLARE
  seq_name TEXT;
  seq_exists BOOLEAN;
  seq_val INTEGER;
  year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  seq_name := 'registration_seq_' || year_str;
  
  -- Check if sequence for the current year exists
  SELECT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE c.relname = seq_name AND c.relkind = 'S'
  ) INTO seq_exists;
  
  IF NOT seq_exists THEN
    EXECUTE 'CREATE SEQUENCE ' || quote_ident(seq_name) || ' START WITH 1';
  END IF;
  
  EXECUTE 'SELECT nextval(' || quote_literal(seq_name) || ')' INTO seq_val;
  NEW.registration_no := 'VSH-' || year_str || '-' || lpad(seq_val::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER set_registration_no
BEFORE INSERT ON registrations
FOR EACH ROW
WHEN (NEW.registration_no IS NULL OR NEW.registration_no = '')
EXECUTE FUNCTION generate_registration_no();

-- ---------------------------------------------------------------------------
-- 4. Audit trail trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_registration_changes()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
BEGIN
  -- Attempt to get the authenticated user's email from Supabase auth metadata
  BEGIN
    admin_email := coalesce(
      current_setting('request.jwt.claims', true)::json->>'email',
      'system'
    );
  EXCEPTION WHEN OTHERS THEN
    admin_email := 'system';
  END;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO registration_status_history (
      registration_id,
      changed_by,
      new_status,
      new_payment_status,
      internal_notes
    ) VALUES (
      NEW.id,
      admin_email,
      NEW.status,
      NEW.payment_status,
      'Registration submitted'
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.status IS DISTINCT FROM NEW.status OR OLD.payment_status IS DISTINCT FROM NEW.payment_status OR OLD.internal_notes IS DISTINCT FROM NEW.internal_notes) THEN
      INSERT INTO registration_status_history (
        registration_id,
        changed_by,
        old_status,
        new_status,
        old_payment_status,
        new_payment_status,
        internal_notes
      ) VALUES (
        NEW.id,
        admin_email,
        OLD.status,
        NEW.status,
        OLD.payment_status,
        NEW.payment_status,
        CASE 
          WHEN OLD.internal_notes IS DISTINCT FROM NEW.internal_notes THEN 'Notes updated: ' || coalesce(NEW.internal_notes, '')
          ELSE 'Status updated'
        END
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER audit_registrations_trigger
AFTER INSERT OR UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION audit_registration_changes();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- ---------------------------------------------------------------------------
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_status_history ENABLE ROW LEVEL SECURITY;

-- registrations policies
DROP POLICY IF EXISTS "public insert registrations" ON registrations;
CREATE POLICY "public insert registrations" ON registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated read registrations" ON registrations;
CREATE POLICY "authenticated read registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated update registrations" ON registrations;
CREATE POLICY "authenticated update registrations" ON registrations FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated delete registrations" ON registrations;
CREATE POLICY "authenticated delete registrations" ON registrations FOR DELETE USING (auth.role() = 'authenticated');

-- status history policies
DROP POLICY IF EXISTS "authenticated read status_history" ON registration_status_history;
CREATE POLICY "authenticated read status_history" ON registration_status_history FOR SELECT USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 6. Add Dynamic Options to site_settings Table
-- ---------------------------------------------------------------------------
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_modes TEXT NOT NULL DEFAULT 'Cash, UPI, Card, Bank Transfer';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS batch_days TEXT NOT NULL DEFAULT '3 Days, 5 Days, Weekend';

-- Update seed row with defaults
UPDATE site_settings
SET 
  payment_modes = 'Cash, UPI, Card, Bank Transfer',
  batch_days = '3 Days, 5 Days, Weekend'
WHERE id = 1 AND (payment_modes IS NULL OR payment_modes = '');
