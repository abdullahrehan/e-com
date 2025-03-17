"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page
    router.push('/')
  }, [router])

  // Optional: Show a loading state or message while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to home...</p>
    </div>
  )
}