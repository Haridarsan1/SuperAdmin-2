import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitCommit, Upload, Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default async function UserActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's updates
  const { data: updates } = await supabase
    .from("project_updates")
    .select(`
      *,
      projects (name, id)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="h-4 w-4" />
      case 'deployment': return <Upload className="h-4 w-4" />
      default: return <Plus className="h-4 w-4" />
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'commit': return 'bg-blue-500/10 text-blue-500'
      case 'deployment': return 'bg-green-500/10 text-green-500'
      case 'bug_fix': return 'bg-red-500/10 text-red-500'
      case 'feature': return 'bg-purple-500/10 text-purple-500'
      case 'milestone': return 'bg-yellow-500/10 text-yellow-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Updates</h1>
          <p className="text-muted-foreground mt-2">
            Track your contributions and activities
          </p>
        </div>
        <Link href="/dashboard/user/activity/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Update
          </Button>
        </Link>
      </div>

      {!updates || updates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              No updates yet. Start by adding your first update!
            </p>
            <Link href="/dashboard/user/activity/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Update
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {updates.map((update: any) => (
            <Card key={update.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getUpdateColor(update.update_type)}`}>
                    {getUpdateIcon(update.update_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg">{update.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                        <Calendar className="h-4 w-4" />
                        {new Date(update.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {update.description && (
                      <p className="text-muted-foreground mb-3">{update.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline">
                        {update.projects?.name || 'Project'}
                      </Badge>
                      <Badge variant="secondary">
                        {update.update_type.replace('_', ' ')}
                      </Badge>
                      {update.source !== 'manual' && (
                        <Badge variant="outline" className="text-xs">
                          Auto-synced from {update.source}
                        </Badge>
                      )}
                    </div>

                    {update.metadata && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        {update.metadata.commit_hash && (
                          <code className="bg-muted px-2 py-1 rounded">
                            {update.metadata.commit_hash.substring(0, 7)}
                          </code>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
