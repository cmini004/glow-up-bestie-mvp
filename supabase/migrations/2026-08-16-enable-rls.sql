-- Migration: Enable Row Level Security and add policies for tenant safety
-- Run this in your Supabase SQL editor or with `psql`.

-- Goals: each row belongs to a user_id
ALTER TABLE IF EXISTS public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "goals_select_own" ON public.goals;
CREATE POLICY "goals_select_own" ON public.goals
  FOR SELECT USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "goals_insert_own" ON public.goals;
CREATE POLICY "goals_insert_own" ON public.goals
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "goals_update_own" ON public.goals;
CREATE POLICY "goals_update_own" ON public.goals
  FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "goals_delete_own" ON public.goals;
CREATE POLICY "goals_delete_own" ON public.goals
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Commitments: only accessible if the parent goal belongs to the user
ALTER TABLE IF EXISTS public.commitments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "commitments_select_own" ON public.commitments;
CREATE POLICY "commitments_select_own" ON public.commitments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = public.commitments.goal_id AND public.goals.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "commitments_insert_own" ON public.commitments;
CREATE POLICY "commitments_insert_own" ON public.commitments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = public.commitments.goal_id AND public.goals.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "commitments_update_own" ON public.commitments;
CREATE POLICY "commitments_update_own" ON public.commitments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = public.commitments.goal_id AND public.goals.user_id = (SELECT auth.uid()))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = public.commitments.goal_id AND public.goals.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "commitments_delete_own" ON public.commitments;
CREATE POLICY "commitments_delete_own" ON public.commitments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = public.commitments.goal_id AND public.goals.user_id = (SELECT auth.uid()))
  );

-- Check-ins: require `user_id` to match the authenticated user
ALTER TABLE IF EXISTS public.check_ins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "checkins_select_own" ON public.check_ins;
CREATE POLICY "checkins_select_own" ON public.check_ins
  FOR SELECT USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "checkins_insert_own" ON public.check_ins;
CREATE POLICY "checkins_insert_own" ON public.check_ins
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "checkins_update_own" ON public.check_ins;
CREATE POLICY "checkins_update_own" ON public.check_ins
  FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "checkins_delete_own" ON public.check_ins;
CREATE POLICY "checkins_delete_own" ON public.check_ins
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- AI conversations: only visible to the conversation owner
ALTER TABLE IF EXISTS public.ai_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ai_conv_select_own" ON public.ai_conversations;
CREATE POLICY "ai_conv_select_own" ON public.ai_conversations FOR SELECT USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "ai_conv_insert_own" ON public.ai_conversations;
CREATE POLICY "ai_conv_insert_own" ON public.ai_conversations FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "ai_conv_update_own" ON public.ai_conversations;
CREATE POLICY "ai_conv_update_own" ON public.ai_conversations FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "ai_conv_delete_own" ON public.ai_conversations;
CREATE POLICY "ai_conv_delete_own" ON public.ai_conversations FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Notes:
-- - Admin/service-role jobs will bypass RLS; use service role for trusted migrations.
-- - To test RLS with the Supabase dashboard, use the SQL editor and run under a non-admin key.
