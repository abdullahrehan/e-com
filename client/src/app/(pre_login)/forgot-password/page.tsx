import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mb-2"
              placeholder="Email address"
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

