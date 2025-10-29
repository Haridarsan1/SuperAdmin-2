import { createClient } from "@/lib/supabase/server"
import { ApiKeysManager } from "@/components/user/api-keys-manager"

export default async function ApiKeysPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Get user's API keys
  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
        <p className="text-muted-foreground mt-2">Manage your API keys for programmatic access</p>
      </div>

      <ApiKeysManager apiKeys={apiKeys || []} />
    </div>
  )
}
