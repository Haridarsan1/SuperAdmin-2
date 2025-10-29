# Admin Dashboard

A Next.js admin dashboard with user authentication and management features.

## Getting Started

### Prerequisites
- Node.js 18+ or later
- pnpm (or npm/yarn)
- Supabase account (for authentication)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:

Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To get these credentials:
- Go to [https://supabase.com](https://supabase.com)
- Create a new project or use an existing one
- Go to Project Settings > API
- Copy the Project URL and anon/public key

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app directory with pages and layouts
  - `/auth` - Authentication pages (login, signup, etc.)
  - `/dashboard` - User dashboard pages
  - `/admin` - Admin panel pages
- `/components` - React components
  - `/ui` - UI components (buttons, cards, etc.)
  - `/dashboard` - Dashboard-specific components
  - `/admin` - Admin-specific components
  - `/user` - User-specific components
- `/lib` - Utility functions and Supabase clients
- `/hooks` - Custom React hooks
- `/public` - Static assets
- `/scripts` - Database migration scripts

## Features

- 🔐 Authentication with Supabase
- 👥 User management
- 📊 Analytics dashboard
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🌙 Dark mode support
- 📱 Responsive design

## Database Setup

If you need to set up the database tables, run the SQL scripts in `/scripts` folder in your Supabase SQL editor:

1. `001_create_tables.sql`
2. `002_create_rls_policies.sql`
3. `003_create_triggers.sql`

## Available Routes

- `/` - Home (redirects to dashboard or login)
- `/auth/login` - Login page
- `/auth/sign-up` - Sign up page
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset
- `/dashboard` - User dashboard
- `/dashboard/analytics` - Analytics page
- `/dashboard/projects` - Projects management
- `/dashboard/settings` - User settings
- `/dashboard/users` - Users list
- `/admin` - Admin panel
- `/admin/projects` - Admin projects management
- `/admin/settings` - Admin settings
- `/admin/team` - Team management

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Notes

⚠️ **Important**: Make sure to update the `.env.local` file with your actual Supabase credentials before running the project.

The project uses Supabase for authentication and database. You'll need to:
1. Create a Supabase project
2. Run the SQL scripts to set up tables
3. Add your Supabase credentials to `.env.local`
