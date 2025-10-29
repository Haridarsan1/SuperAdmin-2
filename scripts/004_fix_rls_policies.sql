-- Fix RLS policies to avoid infinite recursion

-- Drop the problematic superadmin policy
DROP POLICY IF EXISTS "profiles_select_superadmin" ON public.profiles;

-- The "profiles_select_own" policy is enough - users can read their own profile
-- Superadmins can already read their own profile with this policy

-- If you want superadmins to see ALL profiles, we need a different approach
-- We'll allow reading all profiles if you're authenticated (and handle role checks in the app)
CREATE POLICY "profiles_select_all_authenticated" ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Update other policies to avoid recursion
DROP POLICY IF EXISTS "projects_select_superadmin" ON public.projects;
DROP POLICY IF EXISTS "project_members_select" ON public.project_members;
DROP POLICY IF EXISTS "project_members_insert" ON public.project_members;
DROP POLICY IF EXISTS "project_members_delete" ON public.project_members;
DROP POLICY IF EXISTS "login_activity_select_admin" ON public.login_activity;

-- Recreate without recursion - allow authenticated users to read, app handles role checks
CREATE POLICY "projects_select_all_authenticated" ON public.projects 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "project_members_select_all" ON public.project_members 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "project_members_insert_authenticated" ON public.project_members 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "project_members_delete_authenticated" ON public.project_members 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "login_activity_select_all" ON public.login_activity 
FOR SELECT 
TO authenticated
USING (true);

-- Project updates - allow authenticated users to read/write
CREATE POLICY "project_updates_select_all" ON public.project_updates 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "project_updates_insert_authenticated" ON public.project_updates 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Project commits - allow authenticated users to read
CREATE POLICY "project_commits_select_all" ON public.project_commits 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "project_commits_insert_authenticated" ON public.project_commits 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Webhooks - allow authenticated users to manage
CREATE POLICY "webhooks_select_all" ON public.webhooks 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "webhooks_insert_authenticated" ON public.webhooks 
FOR INSERT 
TO authenticated
WITH CHECK (true);
