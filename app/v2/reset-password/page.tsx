"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [oobCode, setOobCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get('oobCode')
    if (code) {
      setOobCode(code)
      verifyPasswordResetCode(auth, code).catch(() => {
        toast({
          title: "Error",
          description: "Invalid or expired reset link. Please try again.",
          variant: "destructive",
        })
      })
    } else {
      toast({
        title: "Error",
        description: "No reset code found. Please try resetting your password again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      toast({
        title: "Success",
        description: "Password reset successful. Redirecting to login...",
      })
      setTimeout(() => {
        router.push('/v2/sing-in')
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!oobCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <p className="text-red-500 text-sm mb-4">Invalid reset link.</p>
          <Link href="/v2/forgot-password" className="text-blue-500 hover:underline">
            Try resetting your password again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleResetPassword} className="p-8 bg-white rounded-lg shadow-md w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  )
}