import { createClient } from "@/lib/supabase/server"
import { DataExport } from "@/components/user/data-export"

export default async function ExportPage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  // Get user data summary
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  const { data: projectMembers } = await supabase.from("project_members").select("project_id").eq("user_id", user?.id)

  const projectIds = projectMembers?.map((pm) => pm.project_id) || []

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds.length > 0 ? projectIds : [""])

  const { data: loginActivity } = await supabase.from("login_activity").select("*").eq("user_id", user?.id)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-2">Download your personal data</p>
      </div>

      <DataExport profile={profile} projects={projects || []} loginActivity={loginActivity || []} />
    </div>
  )
}
