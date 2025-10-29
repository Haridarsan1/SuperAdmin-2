"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="app-name" className="text-foreground">
              Application Name
            </Label>
            <Input id="app-name" placeholder="Admin Dashboard" className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-users" className="text-foreground">
              Max Users
            </Label>
            <Input id="max-users" type="number" placeholder="1000" className="bg-background border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout" className="text-foreground">
              Session Timeout (minutes)
            </Label>
            <Input id="session-timeout" type="number" placeholder="30" className="bg-background border-border" />
          </div>

          <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full bg-transparent">
            Enable Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Reset All API Keys
          </Button>
          <Button variant="destructive" className="w-full">
            Clear All Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
