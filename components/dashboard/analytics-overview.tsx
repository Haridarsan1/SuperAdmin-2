"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, TrendingUp } from "lucide-react"

interface AnalyticsOverviewProps {
  totalUsers: number
  totalProjects: number
  activeUsers: number
}

export function AnalyticsOverview({ totalUsers, totalProjects, activeUsers }: AnalyticsOverviewProps) {
  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.title === "Active Users" ? "Last 30 days" : "Total"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
