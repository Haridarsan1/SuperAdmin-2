-- Insert Dummy Data for Testing

-- Note: You need to create these users via the sign-up page first, or use existing user IDs
-- Replace the UUIDs below with actual user IDs from your auth.users table

-- First, let's check existing users and create some dummy profiles if needed
-- You can run this query first to see your existing users:
-- SELECT id, email FROM auth.users;

-- For this example, we'll assume you have some users already
-- Update the UUIDs below with real user IDs from your database

-- === STEP 0: Add missing columns if they don't exist ===
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;

-- === STEP 1: Update existing profiles with more details ===
-- (Replace the emails with your actual test users)

UPDATE public.profiles 
SET 
  first_name = 'John',
  last_name = 'Doe',
  department = 'Engineering',
  position = 'Senior Developer',
  username = 'johndoe'
WHERE email = 'haridarsan18@gmail.com';

UPDATE public.profiles 
SET 
  first_name = 'Jane',
  last_name = 'Smith',
  department = 'Engineering',
  position = 'Frontend Developer',
  username = 'janesmith'
  -- Keep existing role (SUPERADMIN)
WHERE email = 'haridarsan01@gmail.com';

-- === STEP 2: Insert sample projects ===

-- Try inserting with owner_id (some schemas use owner_id instead of manager_id)
-- If this fails, the error will tell us which column is actually required
DO $$
DECLARE
  manager_user_id UUID;
BEGIN
  -- Get a valid user ID to use as owner/manager
  SELECT id INTO manager_user_id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1;
  
  -- Try with owner_id first (common column name)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'owner_id') THEN
    INSERT INTO public.projects (name, description, owner_id) VALUES
      ('E-Commerce Platform', 'Modern e-commerce platform with React and Node.js', manager_user_id),
      ('Mobile Banking App', 'Cross-platform mobile banking application', manager_user_id),
      ('Data Analytics Dashboard', 'Real-time analytics and reporting dashboard', manager_user_id),
      ('Customer Portal', 'Self-service customer portal', manager_user_id),
      ('Internal CRM', 'Customer relationship management system', manager_user_id);
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'manager_id') THEN
    INSERT INTO public.projects (name, description, manager_id) VALUES
      ('E-Commerce Platform', 'Modern e-commerce platform with React and Node.js', manager_user_id),
      ('Mobile Banking App', 'Cross-platform mobile banking application', manager_user_id),
      ('Data Analytics Dashboard', 'Real-time analytics and reporting dashboard', manager_user_id),
      ('Customer Portal', 'Self-service customer portal', manager_user_id),
      ('Internal CRM', 'Customer relationship management system', manager_user_id);
  ELSE
    -- Fallback: just name and description
    INSERT INTO public.projects (name, description) VALUES
      ('E-Commerce Platform', 'Modern e-commerce platform with React and Node.js'),
      ('Mobile Banking App', 'Cross-platform mobile banking application'),
      ('Data Analytics Dashboard', 'Real-time analytics and reporting dashboard'),
      ('Customer Portal', 'Self-service customer portal'),
      ('Internal CRM', 'Customer relationship management system');
  END IF;
END $$;

-- === STEP 3: Assign employees to projects ===

-- Use only safe role values that are commonly supported
-- Assign first user (haridarsan18@gmail.com) to projects
INSERT INTO public.project_members (project_id, user_id, role) VALUES
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'DEVELOPER'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'DEVELOPER'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Data Analytics Dashboard' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'DEVELOPER'
  );

-- Assign second user (haridarsan01@gmail.com) to projects
INSERT INTO public.project_members (project_id, user_id, role) VALUES
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'DEVELOPER'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Customer Portal' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'DEVELOPER'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Internal CRM' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'DEVELOPER'
  );

-- === STEP 4: Add project updates (manual entries) ===

INSERT INTO public.project_updates (project_id, user_id, title, description, update_type, source) VALUES
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'Implemented shopping cart feature',
    'Added full shopping cart functionality with persistent storage',
    'feature',
    'manual'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'Fixed checkout bug',
    'Resolved issue where discount codes were not applying correctly',
    'bug_fix',
    'manual'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'Completed authentication module',
    'Implemented biometric authentication for iOS and Android',
    'milestone',
    'manual'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Data Analytics Dashboard' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'Daily standup meeting',
    'Discussed Q1 roadmap and sprint planning',
    'meeting',
    'manual'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Customer Portal' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'Updated UI components',
    'Migrated to new design system and updated all components',
    'feature',
    'manual'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Internal CRM' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'Deployed to production',
    'Successfully deployed version 2.0 to production environment',
    'deployment',
    'manual'
  );

-- === STEP 5: Add sample commits (simulating webhook data) ===

INSERT INTO public.project_commits (
  project_id, 
  user_id, 
  commit_hash, 
  commit_message, 
  author_email, 
  author_name, 
  branch, 
  files_changed, 
  additions, 
  deletions,
  committed_at
) VALUES
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'abc123def456',
    'feat: Add product filtering functionality',
    'haridarsan18@gmail.com',
    'John Doe',
    'main',
    8,
    245,
    12,
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'def456ghi789',
    'fix: Resolve payment gateway timeout issue',
    'haridarsan01@gmail.com',
    'Jane Smith',
    'main',
    3,
    45,
    8,
    NOW() - INTERVAL '5 hours'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'ghi789jkl012',
    'feat: Implement biometric authentication',
    'haridarsan18@gmail.com',
    'John Doe',
    'develop',
    12,
    567,
    23,
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Data Analytics Dashboard' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1),
    'jkl012mno345',
    'refactor: Optimize database queries',
    'haridarsan18@gmail.com',
    'John Doe',
    'main',
    15,
    89,
    134,
    NOW() - INTERVAL '3 hours'
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Customer Portal' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'mno345pqr678',
    'style: Update button components',
    'haridarsan01@gmail.com',
    'Jane Smith',
    'feature/ui-update',
    5,
    123,
    67,
    NOW() - INTERVAL '6 hours'
  );

-- === STEP 6: Create webhooks for projects ===

INSERT INTO public.webhooks (project_id, name, webhook_url, secret_key, service_type, is_active) VALUES
  (
    (SELECT id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1),
    'GitHub Webhook',
    'https://yourdomain.com/api/webhooks/github',
    'secret_' || gen_random_uuid()::text,
    'github',
    true
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1),
    'GitLab Webhook',
    'https://yourdomain.com/api/webhooks/gitlab',
    'secret_' || gen_random_uuid()::text,
    'gitlab',
    true
  ),
  (
    (SELECT id FROM public.projects WHERE name = 'Data Analytics Dashboard' LIMIT 1),
    'GitHub Webhook',
    'https://yourdomain.com/api/webhooks/github',
    'secret_' || gen_random_uuid()::text,
    'github',
    true
  );

-- === Verify the data was inserted ===

-- Count projects
SELECT COUNT(*) as total_projects FROM public.projects;

-- Count project members
SELECT COUNT(*) as total_assignments FROM public.project_members;

-- Count updates
SELECT COUNT(*) as total_updates FROM public.project_updates;

-- Count commits
SELECT COUNT(*) as total_commits FROM public.project_commits;

-- View employee project assignments
SELECT 
  p.first_name || ' ' || p.last_name as employee_name,
  pr.name as project_name,
  pm.role as project_role
FROM public.project_members pm
JOIN public.profiles p ON pm.user_id = p.id
JOIN public.projects pr ON pm.project_id = pr.id
ORDER BY p.first_name, pr.name;

-- View recent activity
SELECT 
  p.first_name || ' ' || p.last_name as employee_name,
  pr.name as project_name,
  pu.title,
  pu.update_type,
  pu.created_at
FROM public.project_updates pu
JOIN public.profiles p ON pu.user_id = p.id
JOIN public.projects pr ON pu.project_id = pr.id
ORDER BY pu.created_at DESC;
