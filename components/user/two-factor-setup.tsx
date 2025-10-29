"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Copy, Check } from "lucide-react"

export function TwoFactorSetup() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [copied, setCopied] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const qrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AdminDashboard"

  const handleCopySecret = () => {
    navigator.clipboard.writeText("JBSWY3DPEBLW64TMMQ======")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnable2FA = () => {
    if (verificationCode.length === 6) {
      setIs2FAEnabled(true)
      setShowSetup(false)
      setVerificationCode("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status</p>
            <p className="text-sm text-muted-foreground">{is2FAEnabled ? "Enabled" : "Disabled"}</p>
          </div>
          <Badge variant={is2FAEnabled ? "default" : "secondary"}>{is2FAEnabled ? "Active" : "Inactive"}</Badge>
        </div>

        {!is2FAEnabled ? (
          <AlertDialog open={showSetup} onOpenChange={setShowSetup}>
            <AlertDialogTrigger asChild>
              <Button className="w-full">Enable 2FA</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Set Up Two-Factor Authentication</AlertDialogTitle>
                <AlertDialogDescription>Scan this QR code with your authenticator app</AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode || "/placeholder.svg"} alt="2FA QR Code" className="w-48 h-48" />
                </div>

                <div className="space-y-2">
                  <Label>Or enter this code manually:</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">JBSWY3DPEBLW64TMMQ======</code>
                    <Button variant="outline" size="sm" onClick={handleCopySecret}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEnable2FA} disabled={verificationCode.length !== 6}>
                  Verify & Enable
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button variant="outline" className="w-full bg-transparent">
            Disable 2FA
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
