import { createClient } from "@/lib/supabase/server"
import { ProjectsList } from "@/components/admin/projects-list"

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  // Get projects where user is admin
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user?.id)
    .eq("role", "ADMIN")

  const projectIds = projectMembers?.map((pm) => pm.project_id) || []

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds.length > 0 ? projectIds : [""])
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground mt-2">Manage all your projects</p>
      </div>

      <ProjectsList projects={projects || []} />
    </div>
  )
}
