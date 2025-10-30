import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow access to auth pages and home page without authentication
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isHomePage = request.nextUrl.pathname === "/"
  
  // Special handling for reset password page - allow access if there are reset tokens in URL or hash
  const isResetPasswordPage = request.nextUrl.pathname === "/auth/reset-password"
  const hasResetTokens = request.nextUrl.searchParams.has("access_token") || 
                        request.nextUrl.searchParams.has("type") || 
                        request.nextUrl.hash.includes("access_token")
  
  // Redirect unauthenticated users to login (except for auth pages, home page, or reset password with tokens)
  if (!user && !isAuthPage && !isHomePage && !(isResetPasswordPage && hasResetTokens)) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
