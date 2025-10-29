import type { LoginActivity } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserActivityProps {
  loginActivity: LoginActivity[]
}

export function UserActivity({ loginActivity }: UserActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your login history</CardDescription>
      </CardHeader>
      <CardContent>
        {loginActivity.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {loginActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start justify-between text-sm">
                <div>
                  <p className="font-medium">{activity.success ? "Login Successful" : "Login Failed"}</p>
                  <p className="text-xs text-muted-foreground">{activity.device_info || "Unknown device"}</p>
                </div>
                <Badge variant={activity.success ? "default" : "destructive"}>
                  {new Date(activity.created_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
