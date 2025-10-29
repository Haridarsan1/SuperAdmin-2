import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/dashboard/users-table"
import { BackButton } from "@/components/ui/back-button"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <BackButton href="/dashboard">Back to Dashboard</BackButton>
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground mt-2">Manage all system users and their roles</p>
      </div>

      <UsersTable users={users || []} />
    </div>
  )
}
