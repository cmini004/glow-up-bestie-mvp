-- Users table (managed by Supabase Auth typically)
-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text,
  category text,
  why text,
  obstacle text,
  desired_outcome text,
  start_date timestamptz,
  end_date timestamptz,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Commitments
CREATE TABLE IF NOT EXISTS commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE,
  title text,
  scheduled_at timestamptz,
  duration_minutes int,
  status text,
  completed_at timestamptz,
  rescheduled_to timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commitments_scheduled_at ON commitments(scheduled_at);

-- Check-ins
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id uuid REFERENCES commitments(id) ON DELETE CASCADE,
  user_id uuid,
  type text,
  message text,
  user_response text,
  created_at timestamptz DEFAULT now()
);

-- AI conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  goal_id uuid,
  role text,
  content text,
  created_at timestamptz DEFAULT now()
);
