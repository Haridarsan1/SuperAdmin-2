"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, LogOut } from "lucide-react"

interface SessionManagementProps {
  sessions: any[]
}

export function SessionManagement({ sessions }: SessionManagementProps) {
  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.includes("Mobile")) return <Smartphone className="h-4 w-4" />
    return <Laptop className="h-4 w-4" />
  }

  const getDeviceType = (userAgent: string) => {
    if (userAgent?.includes("Mobile")) return "Mobile"
    if (userAgent?.includes("Tablet")) return "Tablet"
    return "Desktop"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Manage your active sessions across devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getDeviceIcon(session.user_agent)}</div>
                  <div>
                    <p className="font-medium">{getDeviceType(session.user_agent)}</p>
                    <p className="text-sm text-muted-foreground">{session.ip_address}</p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {new Date(session.last_activity).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No active sessions</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
