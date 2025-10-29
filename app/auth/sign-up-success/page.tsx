import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
          <CardDescription className="text-slate-400">
            We&apos;ve sent a confirmation link to your email address. Please click it to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400">
            Once you confirm your email, you&apos;ll be able to log in and access your dashboard.
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
