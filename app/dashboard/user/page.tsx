import { createClient } from "@/lib/supabase/server"
import { UserOverview } from "@/components/user/user-overview"
import { UserProjects } from "@/components/user/user-projects"
import { UserActivity } from "@/components/user/user-activity"

export default async function UserDashboard() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fallback profile if database query fails
  const userProfile = profile || {
    id: user?.id || '',
    email: user?.email || '',
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'User',
    first_name: user?.user_metadata?.first_name || null,
    last_name: null,
    avatar_url: null,
    role: 'USER' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Get projects where user is a member
  const { data: projectMembers } = await supabase.from("project_members").select("project_id").eq("user_id", user?.id)

  const projectIds = projectMembers?.map((pm) => pm.project_id) || []

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds.length > 0 ? projectIds : [""])
    .order("created_at", { ascending: false })
    .limit(5)

  // Get user's recent activity
  const { data: loginActivity } = await supabase
    .from("login_activity")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {userProfile?.first_name || userProfile?.username}</h1>
        <p className="text-muted-foreground mt-2">Here's your dashboard overview</p>
      </div>

      <UserOverview projects={projects || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserProjects projects={projects || []} />
        </div>
        <div>
          <UserActivity loginActivity={loginActivity || []} />
        </div>
      </div>
    </div>
  )
}
