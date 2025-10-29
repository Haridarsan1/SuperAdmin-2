-- Profiles RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_superadmin" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Projects RLS Policies
CREATE POLICY "projects_select_owner" ON public.projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "projects_select_member" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.project_members WHERE project_id = id AND user_id = auth.uid())
);
CREATE POLICY "projects_select_superadmin" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "projects_update_owner" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "projects_delete_owner" ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- Project Members RLS Policies
CREATE POLICY "project_members_select" ON public.project_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND (owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = project_id AND pm.user_id = auth.uid())))
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "project_members_insert" ON public.project_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "project_members_delete" ON public.project_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);

-- Login Activity RLS Policies
CREATE POLICY "login_activity_select_own" ON public.login_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "login_activity_select_admin" ON public.login_activity FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.project_members WHERE project_id = login_activity.project_id AND user_id = auth.uid() AND role = 'ADMIN')
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "login_activity_insert" ON public.login_activity FOR INSERT WITH CHECK (true);

-- Audit Logs RLS Policies
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.project_members WHERE project_id = audit_logs.project_id AND user_id = auth.uid() AND role = 'ADMIN')
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPERADMIN')
);
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPERADMIN', 'ADMIN'))
);

-- API Keys RLS Policies
CREATE POLICY "api_keys_select_own" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "api_keys_insert_own" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "api_keys_delete_own" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- User Sessions RLS Policies
CREATE POLICY "user_sessions_select_own" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_sessions_insert_own" ON public.user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_sessions_delete_own" ON public.user_sessions FOR DELETE USING (auth.uid() = user_id);

-- Notifications RLS Policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
