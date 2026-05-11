"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signUp } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"

export default function SignUp() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await signUp.email({
                name,
                email,
                password
            })

            if (result.error) {
                setError(result.error.message || 'Failed to sign up. Please try again.')
            } else {
                router.push('/dashboard')
            }

        } catch (error) {
            setError('Failed to sign up. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold font-sans">
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Enter your details below to sign up
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 border bg-gray-100 border-red-300 p-1 text-center rounded">
                                {error}
                            </p>
                        )}

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/sign-in" className="font-medium text-primary hover:underline">
                            Sign in
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}