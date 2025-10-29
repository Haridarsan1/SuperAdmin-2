import type { Project, ProjectMember, ProjectUpdate } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock } from "lucide-react"

interface ProjectOverviewProps {
  project: Project | null
  teamMembers: ProjectMember[]
  recentUpdates: ProjectUpdate[]
}

export function ProjectOverview({ project, teamMembers, recentUpdates }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentUpdates.length}</div>
            <p className="text-xs text-muted-foreground">Actions in last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Project Name</p>
            <p className="text-lg font-semibold">{project?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-lg">{project?.description || "No description"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-lg">{new Date(project?.created_at || "").toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.slice(0, 5).map((update) => (
              <div key={update.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium text-sm">{update.title}</p>
                  <p className="text-xs text-muted-foreground">{update.update_type}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(update.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
