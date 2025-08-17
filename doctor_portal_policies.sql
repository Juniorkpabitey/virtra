-- =====================================================
-- DOCTOR PORTAL ROW LEVEL SECURITY POLICIES
-- =====================================================

-- 1. APPOINTMENTS TABLE POLICIES
-- Enable RLS on appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Doctors can read appointments booked with them
CREATE POLICY "Doctors can read appointments booked with them" ON appointments
FOR SELECT USING (
  doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid()
  )
);

-- Doctors can update appointments booked with them
CREATE POLICY "Doctors can update appointments booked with them" ON appointments
FOR UPDATE USING (
  doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid()
  )
);

-- Patients can read their own appointments
CREATE POLICY "Patients can read their own appointments" ON appointments
FOR SELECT USING (user_id = auth.uid());

-- Patients can insert their own appointments
CREATE POLICY "Patients can insert their own appointments" ON appointments
FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================

-- 2. PROFILES TABLE POLICIES
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Doctors can read patient profiles of patients who have appointments with them
CREATE POLICY "Doctors can read patient profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM appointments 
    WHERE appointments.user_id = profiles.id 
    AND appointments.doctor_id IN (
      SELECT id FROM doctors WHERE user_id = auth.uid()
    )
  )
);

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================

-- 3. DOCTORS TABLE POLICIES
-- Enable RLS on doctors table
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Doctors can read their own record
CREATE POLICY "Doctors can read own record" ON doctors
FOR SELECT USING (user_id = auth.uid());

-- Doctors can update their own record
CREATE POLICY "Doctors can update own record" ON doctors
FOR UPDATE USING (user_id = auth.uid());

-- Doctors can insert their own record
CREATE POLICY "Doctors can insert own record" ON doctors
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Patients can read doctor information (for booking appointments)
CREATE POLICY "Patients can read doctor information" ON doctors
FOR SELECT USING (true);

-- =====================================================

-- 4. DOCTOR_CHATS TABLE POLICIES (if you have this table)
-- Enable RLS on doctor_chats table
ALTER TABLE doctor_chats ENABLE ROW LEVEL SECURITY;

-- Doctors can read their own chats
CREATE POLICY "Doctors can read their own chats" ON doctor_chats
FOR SELECT USING (
  doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid()
  )
);

-- Doctors can insert their own chats
CREATE POLICY "Doctors can insert their own chats" ON doctor_chats
FOR INSERT WITH CHECK (
  doctor_id IN (
    SELECT id FROM doctors WHERE user_id = auth.uid()
  )
);

-- =====================================================

-- 5. OPTIONAL: BROADER ACCESS POLICIES
-- Uncomment these if you want doctors to have broader access

-- Allow doctors to read all patient profiles (not just those with appointments)
-- CREATE POLICY "Doctors can read all patient profiles" ON profiles
-- FOR SELECT USING (
--   EXISTS (
--     SELECT 1 FROM doctors WHERE user_id = auth.uid()
--   )
-- );

-- Allow doctors to read all appointments (not just their own)
-- CREATE POLICY "Doctors can read all appointments" ON appointments
-- FOR SELECT USING (
--   EXISTS (
--     SELECT 1 FROM doctors WHERE user_id = auth.uid()
--   )
-- );

-- =====================================================
-- NOTES:
-- 1. Run these SQL commands in your Supabase SQL editor
-- 2. Make sure you have the necessary tables (appointments, profiles, doctors, doctor_chats)
-- 3. The policies ensure that:
--    - Doctors can only see appointments and patient profiles related to their practice
--    - Patients can only see their own appointments and profile
--    - Users can only modify their own data
-- 4. Test the policies by logging in as both a doctor and a patient
-- =====================================================
