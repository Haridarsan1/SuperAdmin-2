"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LoginActivity } from "@/lib/types"
import { format } from "date-fns"

interface SystemMetricsProps {
  loginActivity: LoginActivity[]
}

export function SystemMetrics({ loginActivity }: SystemMetricsProps) {
  const successCount = loginActivity.filter((a) => a.success).length
  const failureCount = loginActivity.filter((a) => !a.success).length
  const successRate = loginActivity.length > 0 ? Math.round((successCount / loginActivity.length) * 100) : 0

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-green-500">{successRate}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Failed Logins</p>
            <p className="text-2xl font-bold text-red-500">{failureCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Recent Login Activity</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {loginActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.ip_address}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), "MMM dd, HH:mm")}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {activity.success ? "Success" : "Failed"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
