import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FolderGit2, GitCommit, Activity, Mail, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const employeeId = resolvedParams.id
  
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  console.log("=== EMPLOYEE DETAIL PAGE DEBUG ===")
  console.log("Current user:", data.user.email)
  console.log("Profile role:", profile?.role)
  console.log("Employee ID param:", employeeId)
  console.log("================================")

  // If not superadmin, redirect
  if (!profile || profile.role !== "SUPERADMIN") {
    console.log("REDIRECTING: Role is", profile?.role, "but need SUPERADMIN")
    redirect("/dashboard/user")
  }

  // Fetch employee details
  const { data: employee } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", employeeId)
    .single()

  if (!employee) {
    redirect("/dashboard")
  }

  // Fetch employee's projects
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select(`
      *,
      projects (*)
    `)
    .eq("user_id", employeeId)

  const projects = projectMembers?.map(pm => ({ ...pm.projects, member_role: pm.role })) || []

  // Fetch employee's updates
  const { data: updates } = await supabase
    .from("project_updates")
    .select(`
      *,
      projects (name)
    `)
    .eq("user_id", employeeId)
    .order("created_at", { ascending: false })
    .limit(20)

  // Fetch employee's commits
  const { data: commits } = await supabase
    .from("project_commits")
    .select(`
      *,
      projects (name)
    `)
    .eq("user_id", employeeId)
    .order("committed_at", { ascending: false })
    .limit(10)

  const totalCommits = commits?.length || 0
  const totalAdditions = commits?.reduce((sum, c) => sum + (c.additions || 0), 0) || 0
  const totalDeletions = commits?.reduce((sum, c) => sum + (c.deletions || 0), 0) || 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={data.user} profile={profile} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
              <BackButton href="/dashboard">Back to Dashboard</BackButton>
            </div>

            {/* Employee Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={employee.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {employee.first_name?.[0]}{employee.last_name?.[0] || employee.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                      {employee.first_name} {employee.last_name || employee.username}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {employee.email}
                      </div>
                      {employee.position && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {employee.position}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Badge variant="secondary">{employee.role}</Badge>
                      {employee.department && (
                        <Badge variant="outline">{employee.department}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Commits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCommits}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Code Added</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{totalAdditions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Code Removed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-{totalDeletions}</div>
                </CardContent>
              </Card>
            </div>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Projects {employee.first_name} is working on</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No projects assigned</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: any) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <FolderGit2 className="h-6 w-6 text-primary" />
                          <Badge variant="outline">{project.member_role}</Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{project.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description || "No description"}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest activity and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {!updates || updates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No updates yet</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update: any) => (
                      <div key={update.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{update.title}</p>
                          {update.description && (
                            <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {update.projects?.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {update.update_type.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(update.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Commits */}
            {commits && commits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Commits</CardTitle>
                  <CardDescription>Git activity from connected repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commits.map((commit: any) => (
                      <div key={commit.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <GitCommit className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{commit.commit_message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {commit.commit_hash?.substring(0, 7)} • {commit.branch}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <Badge variant="outline">{commit.projects?.name}</Badge>
                            <span className="text-green-600">+{commit.additions}</span>
                            <span className="text-red-600">-{commit.deletions}</span>
                            <span className="text-muted-foreground">
                              {new Date(commit.committed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
