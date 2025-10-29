import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { BackButton } from "@/components/ui/back-button"

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <BackButton href="/dashboard">Back to Dashboard</BackButton>
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage system settings and configuration</p>
      </div>

      <SettingsPanel />
    </div>
  )
}
