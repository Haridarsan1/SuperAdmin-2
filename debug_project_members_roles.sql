-- Check what role values are actually allowed in project_members table

-- Query the check constraint to see allowed values
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conname LIKE '%project_members_role%';

-- Also check the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'project_members' 
AND column_name = 'role';

-- Try inserting with different role values to see what works
-- Test with minimal data first
DO $$
DECLARE
    test_project_id UUID;
    test_user_id UUID;
BEGIN
    -- Get test IDs
    SELECT id INTO test_project_id FROM public.projects LIMIT 1;
    SELECT id INTO test_user_id FROM public.profiles WHERE email = 'haridarsan18@gmail.com' LIMIT 1;
    
    -- Try different role values
    BEGIN
        INSERT INTO public.project_members (project_id, user_id, role) 
        VALUES (test_project_id, test_user_id, 'developer');
        RAISE NOTICE 'SUCCESS: lowercase developer works';
        DELETE FROM public.project_members WHERE project_id = test_project_id AND user_id = test_user_id;
    EXCEPTION 
        WHEN check_violation THEN 
            RAISE NOTICE 'FAILED: lowercase developer does not work';
    END;
    
    BEGIN
        INSERT INTO public.project_members (project_id, user_id, role) 
        VALUES (test_project_id, test_user_id, 'member');
        RAISE NOTICE 'SUCCESS: member works';
        DELETE FROM public.project_members WHERE project_id = test_project_id AND user_id = test_user_id;
    EXCEPTION 
        WHEN check_violation THEN 
            RAISE NOTICE 'FAILED: member does not work';
    END;
    
    BEGIN  
        INSERT INTO public.project_members (project_id, user_id, role) 
        VALUES (test_project_id, test_user_id, 'contributor');
        RAISE NOTICE 'SUCCESS: contributor works';
        DELETE FROM public.project_members WHERE project_id = test_project_id AND user_id = test_user_id;
    EXCEPTION 
        WHEN check_violation THEN 
            RAISE NOTICE 'FAILED: contributor does not work';
    END;
END $$;