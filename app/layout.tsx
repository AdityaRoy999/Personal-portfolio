import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ScrollToTop } from "@/components/scroll-totop"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aditya Roy - Backend Developer and Cyber Security Enthusiast",
  description: "Modern portfolio website showcasing full stack development skills, projects, and experience.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
        <ScrollToTop />
      </body>
    </html>
  )
}
