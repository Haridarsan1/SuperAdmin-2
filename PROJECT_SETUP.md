# Project Activity Tracking Dashboard - Setup Guide

## Overview
This dashboard is designed to track employee projects and their activities in real-time. It automatically captures updates from connected repositories and allows manual status updates.

## Key Features

### For Employees:
- **Dashboard**: Overview of assigned projects and recent activity
- **My Projects**: List of all projects they're working on with role information
- **My Updates**: Timeline of all contributions (commits, deployments, updates)
- **Profile**: Personal information and settings
- **Manual Updates**: Add custom updates, meeting notes, milestones

### For Superadmin/Managers:
- **Employee List**: View all employees and filter by department
- **Employee Details**: Click on any employee to see:
  - All projects they're assigned to
  - Recent commits and updates
  - Activity timeline
  - Performance metrics
- **Project Management**: Create and assign projects
- **Real-time Monitoring**: See live updates across all projects

## Database Setup

### Step 1: Run the Updated SQL Scripts

Go to your Supabase SQL Editor and run the updated scripts:

1. **001_create_tables.sql** - Creates:
   - `profiles` (employees with role: EMPLOYEE, MANAGER, SUPERADMIN)
   - `projects` (company projects)
   - `project_members` (who works on what)
   - `project_updates` (manual + auto-synced updates)
   - `project_commits` (git commits)
   - `webhooks` (for GitHub/GitLab integration)
   - `notifications`

2. **002_create_rls_policies.sql** - Security policies
3. **003_create_triggers.sql** - Auto-create profiles

### Step 2: Set Up Webhooks (Optional but Recommended)

#### GitHub Integration:
1. Go to your GitHub repository → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/github`
3. Select events: Push, Pull Request
4. Copy the webhook secret

#### GitLab Integration:
1. Go to Settings → Webhooks
2. URL: `https://your-domain.com/api/webhooks/gitlab`
3. Select: Push events, Tag push events

## Auto-Sync Features

### Automatic Updates Captured:
- ✅ Git commits (with file changes, additions, deletions)
- ✅ Pull requests
- ✅ Deployments
- ✅ Branch merges
- ✅ Issue closures (from Jira/GitHub Issues)

### Manual Updates:
- Meeting notes
- Milestones achieved
- Bug fixes
- Feature completions
- Custom status updates

## Usage Guide

### For Employees:

1. **Login** → Redirects to `/dashboard/user`
2. **View Projects** → See all assigned projects
3. **Add Manual Update**:
   - Click "Add Update" button
   - Select project
   - Choose type (feature, bug_fix, milestone, etc.)
   - Add description
   - Submit

4. **View Activity** → See timeline of all contributions

### For Superadmin:

1. **Login** → Access `/dashboard` (admin view)
2. **View All Employees** → List with search/filter
3. **Click Employee** → See their:
   - Assigned projects
   - Recent commits (auto-synced)
   - Manual updates
   - Activity graph
4. **Assign Projects** → Add employees to projects
5. **Monitor Real-time** → Dashboard updates automatically

## Next Steps to Complete

### 1. Create Webhook Endpoints
Create files:
- `app/api/webhooks/github/route.ts`
- `app/api/webhooks/gitlab/route.ts`

These will automatically create entries in `project_commits` and `project_updates`.

### 2. Update Superadmin Dashboard
Modify `/dashboard/page.tsx` to show:
- Employee list
- Project overview
- Recent activity across all projects

### 3. Create "Add Update" Form
Create `app/dashboard/user/activity/new/page.tsx` with form to manually add updates.

### 4. Set Up Real-time Subscriptions
Use Supabase Realtime to auto-refresh when new commits/updates arrive.

## Database Structure

```
profiles (employees)
  ├── project_members (assignments)
  │     └── projects
  │           ├── project_updates (manual + auto)
  │           ├── project_commits (git commits)
  │           └── webhooks (integrations)
  └── notifications
```

## Current Progress

✅ Database schema updated
✅ Employee sidebar updated  
✅ Employee projects page created
✅ Employee activity page created
✅ User role changed from USER to EMPLOYEE
✅ Removed unnecessary features (API keys, export)

🔄 To Do:
- Create webhook endpoints
- Update superadmin dashboard
- Add manual update form
- Set up real-time sync
- Add employee filtering/search

## Running the App

1. Make sure Supabase is configured in `.env.local`
2. Run SQL scripts in Supabase
3. Start dev server: `pnpm dev`
4. Navigate to `http://localhost:3000`
5. Sign up as employee → Gets redirected to `/dashboard/user`

## Making Someone a Superadmin

Run in Supabase SQL Editor:
```sql
UPDATE profiles 
SET role = 'SUPERADMIN' 
WHERE email = 'your-email@company.com';
```

Then that user can access `/dashboard` (admin view).
