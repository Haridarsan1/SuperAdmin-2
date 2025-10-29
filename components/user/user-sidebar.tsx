"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderGit2, Activity, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

const navItems = [
  { href: "/dashboard/user", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/user/projects", label: "My Projects", icon: FolderGit2 },
  { href: "/dashboard/user/activity", label: "My Updates", icon: Activity },
  { href: "/dashboard/user/profile", label: "Profile", icon: User },
  { href: "/dashboard/user/settings", label: "Settings", icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">My Dashboard</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full justify-start gap-3 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}
