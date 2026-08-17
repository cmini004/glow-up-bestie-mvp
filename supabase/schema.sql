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

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  goal_id uuid,
  role text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security and policies for multi-tenant safety

-- Goals: each row belongs to a user_id
ALTER TABLE IF EXISTS goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "goals_select_own" ON goals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "goals_insert_own" ON goals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "goals_update_own" ON goals FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "goals_delete_own" ON goals FOR DELETE USING (user_id = auth.uid());

-- Commitments: only accessible if the parent goal belongs to the user
ALTER TABLE IF EXISTS commitments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "commitments_select_own" ON commitments FOR SELECT USING (
  EXISTS (SELECT 1 FROM goals WHERE goals.id = commitments.goal_id AND goals.user_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "commitments_insert_own" ON commitments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM goals WHERE goals.id = commitments.goal_id AND goals.user_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "commitments_update_own" ON commitments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM goals WHERE goals.id = commitments.goal_id AND goals.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM goals WHERE goals.id = commitments.goal_id AND goals.user_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "commitments_delete_own" ON commitments FOR DELETE USING (
  EXISTS (SELECT 1 FROM goals WHERE goals.id = commitments.goal_id AND goals.user_id = auth.uid())
);

-- Check-ins: require `user_id` to match the authenticated user
ALTER TABLE IF EXISTS check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "checkins_select_own" ON check_ins FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "checkins_insert_own" ON check_ins FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "checkins_update_own" ON check_ins FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "checkins_delete_own" ON check_ins FOR DELETE USING (user_id = auth.uid());

-- AI conversations: only visible to the conversation owner
ALTER TABLE IF EXISTS ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "ai_conv_select_own" ON ai_conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "ai_conv_insert_own" ON ai_conversations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "ai_conv_update_own" ON ai_conversations FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "ai_conv_delete_own" ON ai_conversations FOR DELETE USING (user_id = auth.uid());

