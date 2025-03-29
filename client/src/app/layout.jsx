"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/others/navbar"
import Authentication from '@/components/others/authentication.jsx'
import ToastProvider from '@/app/Providers/ToastProvider.jsx'
import React from 'react'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body className={"w-[100vw] h-[100vh]"}>
                <ToastProvider>
                    <Authentication>
                        <div className="w-full h-full flex flex-col">
                            <Navbar />
                            {children}
                        </div>
                    </Authentication>
                </ToastProvider>
            </body>
        </html>
    )
}
