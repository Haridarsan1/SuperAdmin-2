-- Simple dummy data insertion - bypassing complex checks

-- Step 1: Add missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;

-- Step 2: Update profiles
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
WHERE email = 'haridarsan01@gmail.com';

-- Step 3: Insert projects with owner_id
DO $$
DECLARE
    owner_user_id UUID;
BEGIN
    SELECT id INTO owner_user_id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1;
    
    INSERT INTO public.projects (name, description, owner_id) VALUES
      ('E-Commerce Platform', 'Modern e-commerce platform with React and Node.js', owner_user_id),
      ('Mobile Banking App', 'Cross-platform mobile banking application', owner_user_id),
      ('Data Analytics Dashboard', 'Real-time analytics and reporting dashboard', owner_user_id);
END $$;

-- Step 4: Check what we have so far
SELECT COUNT(*) as project_count FROM public.projects;
SELECT id, name FROM public.projects LIMIT 3;

-- Step 5: Try a single project member insertion to test roles
DO $$
DECLARE
    test_project_id UUID;
    test_user_id UUID;
BEGIN
    SELECT id INTO test_project_id FROM public.projects WHERE name = 'E-Commerce Platform' LIMIT 1;
    SELECT id INTO test_user_id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1;
    
    IF test_project_id IS NOT NULL AND test_user_id IS NOT NULL THEN
        -- Try the most basic role possible
        INSERT INTO public.project_members (project_id, user_id) 
        VALUES (test_project_id, test_user_id);
        RAISE NOTICE 'SUCCESS: Default role works (no explicit role specified)';
    ELSE 
        RAISE NOTICE 'FAILED: Missing project_id or user_id';
    END IF;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;

-- Step 6: Check what got inserted
SELECT 
    pm.id,
    pr.name as project_name,
    p.first_name || ' ' || p.last_name as employee_name,
    pm.role
FROM public.project_members pm
JOIN public.projects pr ON pm.project_id = pr.id
JOIN public.profiles p ON pm.user_id = p.id;