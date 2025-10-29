import { createClient } from "@/lib/supabase/server"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { BackButton } from "@/components/ui/back-button"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: loginActivity } = await supabase
    .from("login_activity")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: auditLogs } = await supabase.from("project_updates").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <BackButton href="/dashboard">Back to Dashboard</BackButton>
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">System-wide analytics and insights</p>
      </div>

      <AnalyticsCharts loginActivity={loginActivity || []} auditLogs={auditLogs || []} />
    </div>
  )
}
