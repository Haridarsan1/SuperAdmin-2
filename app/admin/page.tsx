// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server"
import { AdminOverview } from "@/components/admin/admin-overview"
import { ProjectsList } from "@/components/admin/projects-list"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // CRITICAL: Block unauthenticated users
  if (!user) {
    redirect("/login") // or "/signin", "/auth", etc.
  }

  // Now user is guaranteed to exist → user.id is safe
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get projects where user is admin
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("role", "ADMIN")

  const projectIds = projectMembers?.map((pm) => pm.project_id) || []

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds.length > 0 ? projectIds : [""])
    .order("created_at", { ascending: false })

  const { data: teamMembers } = await supabase
    .from("project_members")
    .select("*, profiles:user_id(username, email, avatar_url)")
    .in("project_id", projectIds.length > 0 ? projectIds : [""])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your projects and team</p>
      </div>

      <AdminOverview projects={projects || []} teamMembers={teamMembers || []} />

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Your Projects</h2>
        <ProjectsList projects={projects || []} />
      </div>
    </div>
  )
}