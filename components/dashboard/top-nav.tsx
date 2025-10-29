"use client"

import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TopNavProps {
  user: User
  profile: Profile
}

export function TopNav({ user, profile }: TopNavProps) {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 bg-background" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{profile.username || user.email}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {(profile.username || user.email)?.[0]?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
