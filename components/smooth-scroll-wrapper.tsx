"use client"

import type React from "react"

import { useEffect } from "react"

export function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Simple and fast smooth scrolling using native browser behavior
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement
      const href = target.getAttribute("href")

      if (href && href.startsWith("#")) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          // Use native scrollIntoView for instant, smooth scrolling
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          })
          // Update URL without jumping
          history.pushState(null, "", href)
        }
      }
    }

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorClick)
    })

    // Cleanup
    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchorClick)
      })
    }
  }, [])

  return <>{children}</>
}
