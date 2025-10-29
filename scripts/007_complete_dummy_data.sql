-- Complete the dummy data with more assignments and activity
-- Now we know: role='ADMIN' works, owner_id is required for projects

-- Add more project assignments
DO $$
DECLARE
    ecommerce_id UUID;
    mobile_app_id UUID;
    dashboard_id UUID;
    john_id UUID;
    jane_id UUID;
BEGIN
    -- Get project IDs
    SELECT id INTO ecommerce_id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1;
    SELECT id INTO mobile_app_id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1;
    SELECT id INTO dashboard_id FROM public.projects WHERE name = 'Data Analytics Dashboard' LIMIT 1;
    
    -- Get user IDs
    SELECT id INTO john_id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1;
    SELECT id INTO jane_id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1;
    
    -- Add more assignments (avoid duplicates)
    INSERT INTO public.project_members (project_id, user_id, role) VALUES
        (mobile_app_id, john_id, 'ADMIN'),
        (dashboard_id, john_id, 'ADMIN'),
        (ecommerce_id, jane_id, 'ADMIN'),
        (mobile_app_id, jane_id, 'ADMIN')
    ON CONFLICT (project_id, user_id) DO NOTHING;
    
END $$;

-- Add project updates
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
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'Updated dashboard charts',
    'Migrated to new chart library with better performance',
    'feature',
    'manual'
  );

-- Add sample commits
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
    (SELECT id FROM public.projects WHERE name = 'Mobile Banking App' LIMIT 1),
    (SELECT id FROM public.profiles WHERE email = 'haridarsan01@gmail.com' LIMIT 1),
    'def456ghi789',
    'fix: Resolve biometric auth timeout',
    'haridarsan01@gmail.com',
    'Jane Smith',
    'develop',
    3,
    89,
    15,
    NOW() - INTERVAL '5 hours'
  );

-- Show final results
SELECT 'PROJECTS' as table_name, COUNT(*) as count FROM public.projects
UNION ALL
SELECT 'PROJECT_MEMBERS', COUNT(*) FROM public.project_members  
UNION ALL
SELECT 'PROJECT_UPDATES', COUNT(*) FROM public.project_updates
UNION ALL
SELECT 'PROJECT_COMMITS', COUNT(*) FROM public.project_commits;

-- Show employee assignments
SELECT 
    p.first_name || ' ' || p.last_name as employee_name,
    pr.name as project_name,
    pm.role as project_role
FROM public.project_members pm
JOIN public.profiles p ON pm.user_id = p.id
JOIN public.projects pr ON pm.project_id = pr.id
ORDER BY p.first_name, pr.name;