"use client"
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "@/app/firebase/config"
import { useRouter } from 'next/navigation'

export default function ProductsLayout({ children }) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  
  // useEffect(() => {
  //   if (!loading) {
  //     if (!user) {
  //       router.push('/login')
  //     } 
      
  //   }
  // }, [user, loading, router])

  if (loading) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <> 
      {children}
    </>
  )
}