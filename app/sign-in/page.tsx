"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "@/lib/auth/auth-client"


export default function SignIn() {
   const router = useRouter()
  
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [error, setError] = useState('')
      const [loading, setLoading] = useState(false)
  
      async function handleSubmit(e: React.FormEvent) {
          e.preventDefault()
          setLoading(true)
          setError('')
  
          try {
              const result = await signIn.email({
                  email,
                  password
              })
  
              if (result.error) {
                  setError(result.error.message || 'Failed to sign in. Please try again.')
              } else {
                  router.push('/dashboard')
              }
  
          } catch (error) {
              setError('Failed to sign in. Please try again.')
          } finally {
              setLoading(false)
          }
      }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold font-sans">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
              {error && (
                            <p className="text-sm text-red-500 border bg-gray-100 border-red-300 p-1 text-center rounded">
                                {error}
                            </p>
                        )}

            <Button className="w-full" type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}