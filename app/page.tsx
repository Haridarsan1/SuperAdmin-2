import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    // Check user role to redirect to correct dashboard
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    console.log("=== HOME PAGE REDIRECT DEBUG ===")
    console.log("User ID:", data.user.id)
    console.log("User Email:", data.user.email)
    console.log("Profile:", profile)
    console.log("Error:", error)
    console.log("================================")

    if (profile?.role === "SUPERADMIN") {
      console.log("Redirecting to /dashboard (SUPERADMIN)")
      redirect("/dashboard")
    } else {
      console.log("Redirecting to /dashboard/user (role:", profile?.role, ")")
      redirect("/dashboard/user")
    }
  }

  redirect("/auth/login")
}
