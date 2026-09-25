-- Allow doctors to see the patient details attached to their appointments.

DROP POLICY IF EXISTS "doctors_select_appointment_patients" ON patients;

CREATE POLICY "doctors_select_appointment_patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1
      FROM appointments
      WHERE appointments.patient_id = patients.id
        AND appointments.doctor_id = auth.uid()
    )
  );