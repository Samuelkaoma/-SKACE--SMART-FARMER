'use client'

import { createClient } from '@/lib/supabase/client'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Leaf } from 'lucide-react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">SmartFarmer SKACE</h1>
            <p className="text-sm text-emerald-700">By Samuel Kaoma</p>
          </div>

          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-900">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your farming dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-emerald-900">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-emerald-900">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-emerald-700">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                  >
                    Create one
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-emerald-600">
            Empower your farming with data-driven insights
          </p>
        </div>
      </div>
    </div>
  )
}
