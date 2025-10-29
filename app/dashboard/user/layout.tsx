import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserSidebar } from "@/components/user/user-sidebar"
import { UserTopNav } from "@/components/user/user-top-nav"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/auth/login")
  }

  // Get user profile (with error handling for RLS)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Create a fallback profile object if database query fails
  const userProfile = profile || {
    id: data.user.id,
    email: data.user.email || '',
    username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
    first_name: data.user.user_metadata?.first_name || null,
    last_name: data.user.user_metadata?.last_name || null,
    avatar_url: data.user.user_metadata?.avatar_url || null,
    role: 'USER' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserTopNav user={data.user} profile={userProfile} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
