"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LoginActivity, AuditLog } from "@/lib/types"
import { format } from "date-fns"

interface AnalyticsChartsProps {
  loginActivity: LoginActivity[]
  auditLogs: AuditLog[]
}

export function AnalyticsCharts({ loginActivity, auditLogs }: AnalyticsChartsProps) {
  const dailyLogins = loginActivity.reduce(
    (acc, activity) => {
      const date = format(new Date(activity.created_at), "MMM dd")
      const existing = acc.find((a) => a.date === date)
      if (existing) {
        existing.count++
      } else {
        acc.push({ date, count: 1 })
      }
      return acc
    },
    [] as { date: string; count: number }[],
  )

  const actionCounts = auditLogs.reduce(
    (acc, log) => {
      const existing = acc.find((a) => a.action === log.action)
      if (existing) {
        existing.count++
      } else {
        acc.push({ action: log.action, count: 1 })
      }
      return acc
    },
    [] as { action: string; count: number }[],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Daily Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyLogins.slice(-7).map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{day.date}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: `${day.count * 10}px` }} />
                  <span className="text-sm font-medium text-foreground">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Action Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionCounts.slice(0, 6).map((action) => (
              <div key={action.action} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate">{action.action}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${action.count * 5}px` }} />
                  <span className="text-sm font-medium text-foreground">{action.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
