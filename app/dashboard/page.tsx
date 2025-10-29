import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FolderGit2, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SuperadminDashboard() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  console.log("=== SUPERADMIN DASHBOARD DEBUG ===")
  console.log("User ID:", data.user.id)
  console.log("User Email:", data.user.email)
  console.log("Profile:", profile)
  console.log("Profile Role:", profile?.role)
  console.log("Error:", error)
  console.log("===================================")

  // If not superadmin, redirect to user dashboard
  if (!profile || profile.role !== "SUPERADMIN") {
    console.log("REDIRECTING TO /dashboard/user - Profile role is:", profile?.role)
    redirect("/dashboard/user")
  }

  // Fetch all employees (including superadmins for testing)
  const { data: employees } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch all projects
  const { data: projects } = await supabase.from("projects").select("*")

  // Fetch recent updates across all projects
  const { data: recentUpdates, error: updatesError } = await supabase
    .from("project_updates")
    .select(`
      *,
      profiles (first_name, last_name, username, avatar_url),
      projects (name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  console.log("=== DASHBOARD DATA DEBUG ===")
  console.log("Employees:", employees?.length || 0, employees)
  console.log("Projects:", projects?.length || 0, projects)  
  console.log("Recent Updates:", recentUpdates?.length || 0, recentUpdates)
  console.log("Updates Error:", updatesError)
  console.log("==============================")

  // Get project member counts
  const { data: projectMemberCounts } = await supabase
    .from("project_members")
    .select("project_id")

  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const totalEmployees = employees?.length || 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={data.user} profile={profile} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {profile.first_name || "Admin"}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEmployees}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active team members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projects?.length || 0} total projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentUpdates?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">In the last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">High</div>
                  <p className="text-xs text-muted-foreground mt-1">Active development</p>
                </CardContent>
              </Card>
            </div>

            {/* Employees List */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>View and manage your team</CardDescription>
              </CardHeader>
              <CardContent>
                {!employees || employees.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No employees found</p>
                ) : (
                  <div className="space-y-4">
                    {employees.map((employee: any) => (
                      <Link
                        key={employee.id}
                        href={`/dashboard/employees/${employee.id}`}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={employee.avatar_url} />
                            <AvatarFallback>
                              {employee.first_name?.[0]}{employee.last_name?.[0] || employee.username?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">
                              {employee.first_name} {employee.last_name || employee.username}
                            </p>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                          <div className="text-right">
                            {employee.department && (
                              <Badge variant="outline" className="mb-1">
                                {employee.department}
                              </Badge>
                            )}
                            {employee.position && (
                              <p className="text-sm text-muted-foreground">{employee.position}</p>
                            )}
                          </div>
                          <Badge variant="secondary">{employee.role}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                {!recentUpdates || recentUpdates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentUpdates.map((update: any) => (
                      <div key={update.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={update.profiles?.avatar_url} />
                          <AvatarFallback>
                            {update.profiles?.first_name?.[0]}{update.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{update.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {update.profiles?.first_name} {update.profiles?.last_name} • {update.projects?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
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
          </div>
        </main>
      </div>
    </div>
  )
}
