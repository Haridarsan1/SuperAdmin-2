"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      
      // Check URL query parameters first
      let accessToken = searchParams.get('access_token')
      let refreshToken = searchParams.get('refresh_token')
      let tokenType = searchParams.get('type')
      
      // If not in query params, check URL hash (Supabase often uses hash fragments)
      if (!accessToken && typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
        tokenType = hashParams.get('type')
      }
      
      // Check if this is a password recovery link
      if (tokenType === 'recovery' || (accessToken && refreshToken)) {
        try {
          // Set the session from the URL parameters
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken!,
            refresh_token: refreshToken!,
          })
          
          if (error) throw error
          
          if (data.session) {
            setIsValidSession(true)
          } else {
            throw new Error('No session created')
          }
        } catch (error) {
          console.error('Error setting session:', error)
          setIsValidSession(false)
          setError('Invalid or expired reset link. Please request a new password reset.')
        }
      } else {
        // Check if user already has a valid session (in case they navigated directly)
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsValidSession(true)
        } else {
          setIsValidSession(false)
          setError('No valid reset session found. Please use the link from your email.')
        }
      }
    }

    checkSession()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      router.push("/auth/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-slate-400">Verifying reset link...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if session is invalid
  if (isValidSession === false) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-white">Invalid Reset Link</CardTitle>
            <CardDescription className="text-slate-400">
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
            <Button 
              onClick={() => router.push('/auth/forgot-password')} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show password reset form if session is valid
  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Set New Password</CardTitle>
          <CardDescription className="text-slate-400">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <PasswordStrengthIndicator password={password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-200">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-slate-400">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
