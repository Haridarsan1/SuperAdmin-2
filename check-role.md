# Create a New Superuser

## Option 1: Sign up via the app, then upgrade to SUPERADMIN

1. Go to `http://localhost:3000/auth/sign-up` and create a new account
2. After signup, run this query in Supabase SQL Editor to upgrade to SUPERADMIN:

```sql
UPDATE public.profiles 
SET role = 'SUPERADMIN' 
WHERE email = 'new-superuser@example.com';
```

## Option 2: Create directly in Supabase (if you have the user ID)

If the user already exists in `auth.users`, just update their profile:

```sql
UPDATE public.profiles 
SET role = 'SUPERADMIN' 
WHERE email = 'existing-user@example.com';
```

## Verify the superuser was created:

```sql
SELECT id, email, role, username, first_name, last_name 
FROM public.profiles 
WHERE role = 'SUPERADMIN';
```

## Check your current role:

```sql
SELECT id, email, role 
FROM public.profiles 
WHERE email = 'haridarsan18@gmail.com';
```

**After creating/updating, you MUST logout and login again (or clear browser cookies) for the session to pick up the new role.**
