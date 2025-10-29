import type React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout now just passes through - child routes handle their own layouts
  return <>{children}</>
}
