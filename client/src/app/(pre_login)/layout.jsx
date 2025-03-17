"use client"
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/app/firebase/config"
import { useRouter } from 'next/navigation'

function Layout({ children }) {  // Capitalized 'Layout' as per React convention
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/products")
    }
  }, [user, loading, router])

  // Moved console.log for debugging
  console.log(user, 'user')

  return (
    <>
      {loading ?
        <div className='w-[100vw] h-[100vh] flex justify-center items-center '>
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div> : children
      }
    </>
  )
}

export default Layout