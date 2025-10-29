import { createClient } from "@/lib/supabase/server"
import { TwoFactorSetup } from "@/components/user/two-factor-setup"
import { SessionManagement } from "@/components/user/session-management"

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Get user sessions
  const { data: sessions } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", user?.id)
    .order("last_activity", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security</h1>
        <p className="text-muted-foreground mt-2">Manage your security settings and sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TwoFactorSetup />
        <SessionManagement sessions={sessions || []} />
      </div>
    </div>
  )
}
