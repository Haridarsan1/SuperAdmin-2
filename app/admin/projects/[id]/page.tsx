// app/admin/projects/[id]/page.tsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ProjectOverview } from "@/components/admin/project-overview"
import { TeamManagement } from "@/components/admin/team-management"
import { ProjectSettings } from "@/components/admin/project-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // CRITICAL: Block unauthenticated users
  if (!user) {
    redirect("/login")
  }

  // Verify user is admin of this project
  const { data: projectMember } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user.id)  // ← NOW 100% SAFE
    .eq("role", "ADMIN")
    .single()

  if (!projectMember) {
    notFound()
  }

  // Get project details
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (!project) {
    notFound()
  }

  // Get team members
  const { data: teamMembers } = await supabase
    .from("project_members")
    .select("*, profiles:user_id(id, username, email, avatar_url, role)")
    .eq("project_id", id)

  // Get project activity
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
        <p className="text-muted-foreground mt-2">{project.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProjectOverview
            project={project}
            teamMembers={teamMembers || []}
            auditLogs={auditLogs || []}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManagement projectId={id} teamMembers={teamMembers || []} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ProjectSettings project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}