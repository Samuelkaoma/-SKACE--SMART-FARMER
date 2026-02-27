import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">Welcome to SmartFarmer SKACE!</h1>
            <p className="text-emerald-700">By Samuel Kaoma</p>
          </div>

          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-900 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Verify Your Email
              </CardTitle>
              <CardDescription>
                Almost there! Confirm your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-emerald-900">
                  Check your email inbox for a confirmation link
                </p>
                <p className="text-sm text-emerald-700">
                  We&apos;ve sent a confirmation email to your address. Click the link in the email to verify your account.
                </p>
                <p className="text-xs text-emerald-600">
                  Didn&apos;t receive it? Check your spam folder.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-emerald-100">
                <p className="text-sm text-emerald-700 font-medium">Once verified, you can:</p>
                <ul className="text-sm space-y-2 text-emerald-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Set up your farm profile and preferences</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Start tracking crops and livestock</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Get AI-powered farming recommendations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Access market intelligence and analytics</span>
                  </li>
                </ul>
              </div>

              <Link href="/auth/login" className="block w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-emerald-600">
            Need help? Contact support@smartfarmer-skace.com
          </p>
        </div>
      </div>
    </div>
  )
}
