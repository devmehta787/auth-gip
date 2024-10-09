"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, actionCodeSettings } from '@/lib/firebase'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      toast({
        title: "Reset email sent",
        description: "Please check your inbox for further instructions.",
      })
      setTimeout(() => {
        router.push('/v2/sing-in')
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please check your email address and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleResetPassword} className="p-8 bg-white rounded-lg shadow-md w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </div>
        <div className="text-center">
          <Link href="/v2/sing-in" className="text-sm text-blue-500 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}