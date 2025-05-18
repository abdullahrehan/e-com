"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FaEnvelope, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // Import Link for client-side navigation
import useAdmin from "../../../hooks/useAdmin"
import useAuth from "../../../hooks/useAuth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Forgot Password States
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0)
  const [forgotEmail, setForgotEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { login, forgotPassword, verifyResetPassword, resetPassword} = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setLoading(true)
      const body = {
        "email": email,
        "password": password
      }
      const response = await login(body)
      if (response.status) {
        localStorage.setItem("authToken", response.data.token)
        setEmail("")
        setPassword("")
        router.push("/products")
      }
    } catch (error) {
      console.log(error)
      localStorage.setItem("user", "false")
    } finally {
      setLoading(false)
    }
  }

  // Handle Email Submission for Forgot Password
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setErrorMessage("")
    try {
      const response = await forgotPassword({ email: forgotEmail })
      if (response.status) {
        setForgotPasswordStep(2) // Show "code sent" message
        setTimeout(() => setForgotPasswordStep(3), 5000) // Proceed after 5 seconds
      } else {
        setErrorMessage(response.message || "Failed to send verification code.")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  // Handle Verification Code Submission
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setErrorMessage("")
    try {
      const response = await verifyResetPassword({ email: forgotEmail, code: verificationCode })
      if (response.status) {
        setForgotPasswordStep(4) // Show "code verified" message
        setTimeout(() => setForgotPasswordStep(5), 2000) // Proceed after 2 seconds
      } else {
        setErrorMessage(response.message || "Invalid verification code.")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  // Handle Password Reset Submission
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }
    setForgotLoading(true)
    setErrorMessage("")
    try {
      const response = await resetPassword({
        email: forgotEmail,
        code: verificationCode,
        newPassword: newPassword
      })
      if (response.status) {
        resetForgotPassword() // Close popup and reset states
      } else {
        setErrorMessage(response.message || "Failed to reset password.")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  // Reset Forgot Password States
  const resetForgotPassword = () => {
    setForgotPasswordStep(0)
    setForgotEmail("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setErrorMessage("")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <Input
                id="email-address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="mb-2"
                placeholder="Email address"
              />
            </div>
            <div>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" loading={loading} loadingText="Signing in...">
              Sign in
            </Button>
            {/* Forgot Password Button (Replaces Link) */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setForgotPasswordStep(1)}
                className="text-sm text-gray-600 hover:underline focus:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordStep > 0} onOpenChange={(open) => !open && resetForgotPassword()}>
      <DialogContent className="min-h-[400px] p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
        {/* Step 1: Enter Email */}
        {forgotPasswordStep === 1 && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">Forgot Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="flex items-center border-b-2 border-gray-300">
                <FaEnvelope className="text-gray-500 mr-2" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  disabled={forgotLoading}
                  className="border-none focus:ring-0 w-full py-2"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
              <Button type="submit" className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg" disabled={forgotLoading}>
                {forgotLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Verification Code Sent Message */}
        {forgotPasswordStep === 2 && (
          <div className="text-center space-y-4">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto" />
            <p className="text-lg text-gray-700">A verification code has been sent to your email.</p>
            <Button
              onClick={() => setForgotPasswordStep(3)}
              className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Proceed to Verify Code
            </Button>
          </div>
        )}

        {/* Step 3: Enter Verification Code */}
        {forgotPasswordStep === 3 && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">Enter Verification Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="flex items-center border-b-2 border-gray-300">
                <FaLock className="text-gray-500 mr-2" />
                <Input
                  type="text"
                  placeholder="Enter the code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  disabled={forgotLoading}
                  className="border-none focus:ring-0 w-full py-2"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
              <Button type="submit" className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg" disabled={forgotLoading}>
                {forgotLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 4: Code Verified Message */}
        {forgotPasswordStep === 4 && (
          <div className="text-center space-y-4">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto" />
            <p className="text-lg text-gray-700">Code verified successfully.</p>
            <Button
              onClick={() => setForgotPasswordStep(5)}
              className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Proceed to Reset Password
            </Button>
          </div>
        )}

        {/* Step 5: Reset Password */}
        {forgotPasswordStep === 5 && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">Reset Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="flex items-center border-b-2 border-gray-300">
                <FaLock className="text-gray-500 mr-2" />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={forgotLoading}
                  className="border-none focus:ring-0 w-full py-2"
                />
              </div>
              <div className="flex items-center border-b-2 border-gray-300">
                <FaLock className="text-gray-500 mr-2" />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={forgotLoading}
                  className="border-none focus:ring-0 w-full py-2"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
              <Button type="submit" className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg" disabled={forgotLoading}>
                {forgotLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </div>
  )
}