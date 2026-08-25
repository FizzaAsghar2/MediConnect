/*
# Create MediConnect Core Tables

## What This Does
Creates the three tables MediConnect needs to function: doctors, patients, and appointments.
Each table has Row Level Security (RLS) enabled with policies so users can only
access their own data — patients see only their own profile and appointments,
doctors see only their own profile and their incoming appointments.

## New Tables

1. `doctors`
   - `id` (uuid, primary key, references auth.users) — the doctor's auth account
   - `full_name` (text) — doctor's display name
   - `email` (text) — contact email
   - `specialty` (text) — medical specialty
   - `experience` (text) — years of experience
   - `availability` (boolean, default true) — whether accepting new appointments
   - `available_days` (text) — e.g. "Monday,Tuesday"
   - `start_time` (time) — working hours start
   - `end_time` (time) — working hours end
   - `image` (text) — optional profile photo URL
   - `created_at` (timestamptz)

2. `patients`
   - `id` (uuid, primary key, references auth.users) — the patient's auth account
   - `full_name` (text) — patient's display name
   - `email` (text) — contact email
   - `age` (text) — patient age
   - `gender` (text) — patient gender
   - `created_at` (timestamptz)

3. `appointments`
   - `id` (uuid, primary key, auto-generated)
   - `patient_id` (uuid, references patients) — who booked
   - `doctor_id` (uuid, references doctors) — which doctor
   - `appointment_date` (date) — appointment date
   - `appointment_time` (time) — appointment time
   - `status` (text, default 'Pending') — Pending / Approved / Cancelled
   - `created_at` (timestamptz)

## Security (RLS)

### doctors table
- SELECT: any authenticated user can browse doctors (patients need to find doctors)
- INSERT: a user can insert only their own doctor profile
- UPDATE: a doctor can update only their own profile
- DELETE: a doctor can delete only their own profile

### patients table
- SELECT: a patient can view only their own profile
- INSERT: a user can insert only their own patient profile
- UPDATE: a patient can update only their own profile
- DELETE: a patient can delete only their own profile

### appointments table
- SELECT: patients see their own appointments; doctors see appointments booked with them
- INSERT: a patient can create appointments only for themselves
- UPDATE: a doctor can update status of their own appointments; a patient can cancel their own
- DELETE: restricted to the appointment's patient or doctor
*/

-- ===================== DOCTORS =====================
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text DEFAULT '',
  specialty text DEFAULT '',
  experience text DEFAULT '',
  availability boolean DEFAULT true,
  available_days text DEFAULT '',
  start_time time,
  end_time time,
  image text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doctors_select_all" ON doctors;
CREATE POLICY "doctors_select_all"
  ON doctors FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "doctors_insert_own" ON doctors;
CREATE POLICY "doctors_insert_own"
  ON doctors FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "doctors_update_own" ON doctors;
CREATE POLICY "doctors_update_own"
  ON doctors FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "doctors_delete_own" ON doctors;
CREATE POLICY "doctors_delete_own"
  ON doctors FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ===================== PATIENTS =====================
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text DEFAULT '',
  age text DEFAULT '',
  gender text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patients_select_own" ON patients;
CREATE POLICY "patients_select_own"
  ON patients FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "patients_insert_own" ON patients;
CREATE POLICY "patients_insert_own"
  ON patients FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "patients_update_own" ON patients;
CREATE POLICY "patients_update_own"
  ON patients FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "patients_delete_own" ON patients;
CREATE POLICY "patients_delete_own"
  ON patients FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ===================== APPOINTMENTS =====================
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "appointments_select_own" ON appointments;
CREATE POLICY "appointments_select_own"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "appointments_insert_own" ON appointments;
CREATE POLICY "appointments_insert_own"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "appointments_update_own" ON appointments;
CREATE POLICY "appointments_update_own"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "appointments_delete_own" ON appointments;
CREATE POLICY "appointments_delete_own"
  ON appointments FOR DELETE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- ===================== INDEXES =====================
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
