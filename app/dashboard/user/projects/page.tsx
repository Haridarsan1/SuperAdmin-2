import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderGit2, Users, GitCommit, Clock } from "lucide-react"
import Link from "next/link"

export default async function UserProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get projects where user is a member
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select(`
      *,
      projects (*)
    `)
    .eq("user_id", user.id)

  const projects = projectMembers?.map(pm => pm.projects) || []

  // Get recent commits for each project
  const projectIds = projects.map(p => p.id)
  const { data: recentCommits } = await supabase
    .from("project_commits")
    .select("*")
    .in("project_id", projectIds)
    .eq("user_id", user.id)
    .order("committed_at", { ascending: false })
    .limit(5)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-muted-foreground mt-2">
          Projects you're currently working on
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't been assigned to any projects yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => {
            const projectCommits = recentCommits?.filter(c => c.project_id === project.id) || []
            const memberInfo = projectMembers?.find(pm => pm.projects.id === project.id)

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FolderGit2 className="h-8 w-8 text-primary" />
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Role: <Badge variant="outline" className="ml-2">{memberInfo?.role}</Badge>
                  </div>
                  
                  {project.repository_url && (
                    <a 
                      href={project.repository_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block truncate"
                    >
                      View Repository →
                    </a>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <GitCommit className="h-4 w-4 mr-1" />
                        {projectCommits.length} recent commits
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {recentCommits && recentCommits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Commits</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentCommits.map((commit: any) => (
                  <div key={commit.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <GitCommit className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{commit.commit_message}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {commit.commit_hash?.substring(0, 7)} • {commit.branch}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="text-green-600">+{commit.additions}</span>
                        <span className="text-red-600">-{commit.deletions}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(commit.committed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
