-- Enable Row Level Security on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow doctors to read patient profiles
-- This policy allows doctors to read profiles of patients who have appointments with them
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

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Optional: Create policy to allow doctors to read all profiles (if you want broader access)
-- Uncomment the following if you want doctors to see all patient profiles:
-- CREATE POLICY "Doctors can read all patient profiles" ON profiles
-- FOR SELECT USING (
--   EXISTS (
--     SELECT 1 FROM doctors WHERE user_id = auth.uid()
--   )
-- );
