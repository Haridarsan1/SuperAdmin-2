"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditLog } from "@/lib/types"
import { format } from "date-fns"

interface RecentActivityProps {
  auditLogs: AuditLog[]
}

export function RecentActivity({ auditLogs }: RecentActivityProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditLogs.slice(0, 8).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.resource_type}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(log.created_at), "MMM dd, HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
