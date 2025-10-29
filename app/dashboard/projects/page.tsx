import { createClient } from "@/lib/supabase/server"
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { BackButton } from "@/components/ui/back-button"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <BackButton href="/dashboard">Back to Dashboard</BackButton>
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
        <p className="text-muted-foreground mt-2">Manage all projects in the system</p>
      </div>

      <ProjectsTable projects={projects || []} />
    </div>
  )
}
