import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function AdminTeamPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Get projects where user is admin
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user?.id)
    .eq("role", "ADMIN")

  const projectIds = projectMembers?.map((pm) => pm.project_id) || []

  // Get all team members across admin's projects
  const { data: teamMembers } = await supabase
    .from("project_members")
    .select("*, profiles:user_id(id, username, email, avatar_url), projects:project_id(name)")
    .in("project_id", projectIds.length > 0 ? projectIds : [""])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
        <p className="text-muted-foreground mt-2">Manage team members across your projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Team Members</CardTitle>
          <CardDescription>Members across all your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={(member as any).profiles?.avatar_url || ""} />
                      <AvatarFallback>{(member as any).profiles?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{(member as any).profiles?.username}</p>
                      <p className="text-sm text-muted-foreground">{(member as any).profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">{(member as any).projects?.name}</p>
                    <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>{member.role}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No team members yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
