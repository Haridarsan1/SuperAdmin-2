import { createClient } from "@/lib/supabase/server"
import { NotificationsCenter } from "@/components/user/notifications-center"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  // Get user's notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">Manage your notifications and alerts</p>
      </div>

      <NotificationsCenter notifications={notifications || []} />
    </div>
  )
}
