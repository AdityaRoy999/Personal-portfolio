"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { throttle } from "@/lib/utils"

export function CustomCursor() {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const targetRef = useRef({ x: 0, y: 0 })
  const cursorVisible = useRef(false)
  const requestRef = useRef<number>()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
    
    // Simplified desktop detection - less strict
    const checkIsDesktop = () => {
      // Check if it's likely a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const hasSmallScreen = window.innerWidth < 768 || window.innerHeight < 600
      const isTouchOnly = navigator.maxTouchPoints > 0 && !window.matchMedia('(hover: hover)').matches
      
      // Return true for desktop if it's not mobile and not touch-only
      return !isMobile && !hasSmallScreen && !isTouchOnly
    }

    setIsDesktop(checkIsDesktop())

    // Listen for screen size changes
    const handleResize = () => {
      setIsDesktop(checkIsDesktop())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get the current theme (light or dark)
  const currentTheme = mounted ? resolvedTheme || theme : "dark"

  useEffect(() => {
    // ✅ UNCOMMENTED: Only run cursor logic on desktop devices
    if (!isDesktop) return

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

    // Handle click events for blob animation
    const onMouseDown = () => {
      setIsClicking(true)
    }

    const onMouseUp = () => {
      setIsClicking(false)
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
        const outer = cursorOuterRef.current
        const inner = cursorInnerRef.current

        const currentX = targetRef.current.x
        const currentY = targetRef.current.y

        // Calculate scale based on state - less aggressive center shrinking
        let outerScale = 1
        let innerScale = 1

        if (isClicking) {
          outerScale = 1.8 // Blob effect on click
          innerScale = 0.7 // Less shrink for center dot
        } else if (isHovering) {
          outerScale = 1.3 // Hover effect
          innerScale = 1
        }

        // Apply smooth animation using transform3d for hardware acceleration
        outer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0) scale(${outerScale})`
        inner.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0) scale(${innerScale})`
      }

      requestRef.current = requestAnimationFrame(animateCursor)
    }

    // Function to add event listeners to interactive elements
    const addInteractiveListeners = () => {
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
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)

    // Initial setup of interactive elements
    let interactiveElements = addInteractiveListeners()

    // Observer to watch for new interactive elements
    const observer = new MutationObserver(() => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive)
        el.removeEventListener("mouseleave", onMouseLeaveInteractive)
      })
      interactiveElements = addInteractiveListeners()
    })

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
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive)
        el.removeEventListener("mouseleave", onMouseLeaveInteractive)
      })

      observer.disconnect()

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovering, isClicking, currentTheme, isDesktop]) // ✅ Added isDesktop to dependencies

  // ✅ CHANGED: Don't render if not mounted OR not desktop
  if (!mounted || !isDesktop) return null

  // Determine colors based on theme and state
  const getOuterColor = () => {
    if (isClicking) {
      return currentTheme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"
    }
    return "transparent"
  }

  const getBorderColor = () => {
    return currentTheme === "light" ? "#000000" : "#ffffff"
  }

  const getInnerColor = () => {
    return currentTheme === "light" ? "#000000" : "#ffffff"
  }

  return (
    <>
      {/* Main cursor - becomes blob on click */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-all will-change-transform"
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: `1.5px solid ${getBorderColor()}`,
          backgroundColor: getOuterColor(),
          transitionDuration: isClicking ? "80ms" : isHovering ? "150ms" : "120ms",
          transitionTimingFunction: "ease-out",
          backdropFilter: isClicking ? "blur(0.5px)" : "none",
        }}
      />

      {/* Inner cursor dot */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform transition-all"
        style={{
          width: "5px",
          height: "5px",
          backgroundColor: getInnerColor(),
          borderRadius: "50%",
          transitionDuration: "60ms",
          transitionTimingFunction: "ease-out",
        }}
      />
    </>
  )
}