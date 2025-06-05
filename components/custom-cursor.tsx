"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { throttle } from "@/lib/utils"

export function CustomCursor() {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const targetRef = useRef({ x: 0, y: 0 })
  const cursorVisible = useRef(false)
  const requestRef = useRef<number>()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the current theme (light or dark)
  const currentTheme = mounted ? resolvedTheme || theme : "dark"

  useEffect(() => {
    // Handle cursor visibility
    const onMouseEnter = () => {
      cursorVisible.current = true
      if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = "1"
      if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = "1"
    }

    const onMouseLeave = () => {
      cursorVisible.current = false
      if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = "0"
      if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = "0"
    }

    // Throttled mouse move for performance
    const onMouseMove = throttle((e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }

      // If cursor isn't visible yet, position it immediately to avoid "jumping"
      if (!cursorVisible.current) {
        if (cursorOuterRef.current) {
          cursorOuterRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`
        }
        if (cursorInnerRef.current) {
          cursorInnerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`
        }
      }
    }, 8) // Higher frequency for cursor (120fps)

    // Handle interactive elements - including terminal and chat elements
    const onMouseEnterInteractive = () => setIsHovering(true)
    const onMouseLeaveInteractive = () => setIsHovering(false)

    // Animation loop for smooth cursor movement
    const animateCursor = () => {
      if (cursorVisible.current && cursorOuterRef.current && cursorInnerRef.current) {
        // Get current position from transform
        const outer = cursorOuterRef.current
        const inner = cursorInnerRef.current

        // Extract current position or use default
        const currentX = targetRef.current.x
        const currentY = targetRef.current.y

        // Apply smooth animation using transform3d for hardware acceleration
        outer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0) scale(${isHovering ? 1.5 : 1})`
        inner.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0)`
      }

      requestRef.current = requestAnimationFrame(animateCursor)
    }

    // Function to add event listeners to interactive elements
    const addInteractiveListeners = () => {
      // Add hover effects to all interactive elements including those in modals/overlays
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], input, textarea, select, [data-interactive="true"], .cursor-pointer',
      )

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive)
        el.addEventListener("mouseleave", onMouseLeaveInteractive)
      })

      return interactiveElements
    }

    // Add event listeners
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mousemove", onMouseMove)

    // Initial setup of interactive elements
    let interactiveElements = addInteractiveListeners()

    // Observer to watch for new interactive elements (for dynamic content like chat messages)
    const observer = new MutationObserver(() => {
      // Remove old listeners
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive)
        el.removeEventListener("mouseleave", onMouseLeaveInteractive)
      })
      // Add new listeners
      interactiveElements = addInteractiveListeners()
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Start animation loop
    requestRef.current = requestAnimationFrame(animateCursor)

    // Cleanup
    return () => {
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousemove", onMouseMove)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive)
        el.removeEventListener("mouseleave", onMouseLeaveInteractive)
      })

      observer.disconnect()

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovering, currentTheme])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null

  // Determine colors based on theme - solid colors without transparency
  const outerBorderColor = currentTheme === "light" ? "#000000" : "#ffffff"
  const innerColor = currentTheme === "light" ? "#000000" : "#ffffff"

  return (
    <>
      {/* Main cursor - solid border without transparency */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-transform will-change-transform"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: `2px solid ${outerBorderColor}`,
          backgroundColor: "transparent",
          transitionDuration: isHovering ? "200ms" : "100ms",
          transitionTimingFunction: "ease-out",
        }}
      />

      {/* Inner cursor dot - solid color */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform"
        style={{
          width: "6px",
          height: "6px",
          backgroundColor: innerColor,
          borderRadius: "50%",
          transitionDuration: "50ms",
          transitionTimingFunction: "ease-out",
        }}
      />
    </>
  )
}
