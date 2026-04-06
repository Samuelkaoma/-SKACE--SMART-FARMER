'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Leaf } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault()
    const supabase = createClient()

    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      router.push('/auth/sign-up-success')
    } catch (signUpError: unknown) {
      setError(signUpError instanceof Error ? signUpError.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="space-y-2 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">SmartFarmer SKACE</h1>
            <p className="text-sm text-emerald-700">By Samuel Kaoma</p>
          </div>

          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-900">Create account</CardTitle>
              <CardDescription>Start your smart farming journey today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label className="text-emerald-900" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      className="border-emerald-200 focus:border-emerald-500"
                      id="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="your@email.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-emerald-900" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      className="border-emerald-200 focus:border-emerald-500"
                      id="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      required
                      type="password"
                      value={password}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-emerald-900" htmlFor="repeat-password">
                      Confirm password
                    </Label>
                    <Input
                      className="border-emerald-200 focus:border-emerald-500"
                      id="repeat-password"
                      onChange={(event) => setRepeatPassword(event.target.value)}
                      placeholder="Repeat password"
                      required
                      type="password"
                      value={repeatPassword}
                    />
                  </div>
                  {error ? (
                    <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}
                  <Button
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-emerald-700">
                  Already have an account?{' '}
                  <Link
                    className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
                    href="/auth/login"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-emerald-600">
            Secure | Free | Data-driven farming
          </p>
        </div>
      </div>
    </div>
  )
}
