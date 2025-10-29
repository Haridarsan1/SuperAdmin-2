"use client"

import { useState } from "react"
import type { Profile, Project, LoginActivity } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface DataExportProps {
  profile: Profile | null
  projects: Project[]
  loginActivity: LoginActivity[]
}

export function DataExport({ profile, projects, loginActivity }: DataExportProps) {
  const [selectedData, setSelectedData] = useState({
    profile: true,
    projects: true,
    loginActivity: true,
  })

  const handleExport = () => {
    const exportData: any = {}

    if (selectedData.profile) {
      exportData.profile = profile
    }
    if (selectedData.projects) {
      exportData.projects = projects
    }
    if (selectedData.loginActivity) {
      exportData.loginActivity = loginActivity
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `user-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelection = (key: keyof typeof selectedData) => {
    setSelectedData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
        <CardDescription>Download a copy of your personal data in JSON format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox id="profile" checked={selectedData.profile} onCheckedChange={() => toggleSelection("profile")} />
            <Label htmlFor="profile" className="cursor-pointer">
              <div>
                <p className="font-medium">Profile Information</p>
                <p className="text-sm text-muted-foreground">Your personal details and account info</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="projects"
              checked={selectedData.projects}
              onCheckedChange={() => toggleSelection("projects")}
            />
            <Label htmlFor="projects" className="cursor-pointer">
              <div>
                <p className="font-medium">Projects ({projects.length})</p>
                <p className="text-sm text-muted-foreground">All projects you're part of</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="loginActivity"
              checked={selectedData.loginActivity}
              onCheckedChange={() => toggleSelection("loginActivity")}
            />
            <Label htmlFor="loginActivity" className="cursor-pointer">
              <div>
                <p className="font-medium">Login Activity ({loginActivity.length})</p>
                <p className="text-sm text-muted-foreground">Your login history and sessions</p>
              </div>
            </Label>
          </div>
        </div>

        <Button onClick={handleExport} disabled={!Object.values(selectedData).some((v) => v)} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Your data will be downloaded as a JSON file. This file contains all your selected personal data and can be
            imported into other services or kept as a backup.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
