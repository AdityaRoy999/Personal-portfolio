"use client"

import { useEffect, useRef } from "react"
import { throttle } from "@/lib/utils"

export function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const pointsRef = useRef<
    Array<{
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
    }>
  >([])
  const rafRef = useRef<number | NodeJS.Timeout>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set initial mouse position to center
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Regenerate points when canvas is resized
      generatePoints()
    }

    // Generate fewer points for better performance
    const generatePoints = () => {
      // Clear existing points
      pointsRef.current = []

      // Calculate grid size based on screen size - larger grid for fewer points
      const gridSize = Math.max(60, Math.floor(window.innerWidth / 30))

      // Generate fewer points for better performance
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          // Add some randomness to point positions
          const offsetX = (Math.random() - 0.5) * (gridSize * 0.5)
          const offsetY = (Math.random() - 0.5) * (gridSize * 0.5)

          pointsRef.current.push({
            x: x + offsetX,
            y: y + offsetY,
            baseX: x + offsetX,
            baseY: y + offsetY,
            size: Math.random() * 1.2 + 0.3, // Smaller points for better performance
          })
        }
      }
    }

    // Heavily throttle mouse move events for better performance
    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }, 32) // ~30fps for mouse tracking

    // Draw function optimized for maximum performance
    const draw = () => {
      // Clear with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const points = pointsRef.current
      const mousePosition = mouseRef.current
      const maxDistance = 120 // Reduced interaction distance

      // Update points based on mouse position - simplified calculations
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const dx = mousePosition.x - point.baseX
        const dy = mousePosition.y - point.baseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Apply force with easing for smoother movement
        if (distance < maxDistance) {
          const force = ((maxDistance - distance) / maxDistance) * 0.15
          point.x = point.baseX - dx * force
          point.y = point.baseY - dy * force
        } else {
          // Smooth return to base position
          point.x += (point.baseX - point.x) * 0.1
          point.y += (point.baseY - point.y) * 0.1
        }
      }

      // Draw connections - simplified with single pass and no effects
      const connectionDistance = 60 // Reduced connection distance
      ctx.beginPath()
      ctx.strokeStyle = "rgba(147, 51, 234, 0.2)" // Simple color with low opacity
      ctx.lineWidth = 1

      for (let i = 0; i < points.length; i++) {
        const pointA = points[i]

        // Only check nearby points for connections (spatial optimization)
        for (let j = i + 1; j < points.length; j++) {
          const pointB = points[j]
          const dx = pointA.x - pointB.x
          const dy = pointA.y - pointB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.moveTo(pointA.x, pointA.y)
            ctx.lineTo(pointB.x, pointB.y)
          }
        }
      }
      ctx.stroke()

      // Draw points - simplified with no effects
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const dx = mousePosition.x - point.x
        const dy = mousePosition.y - point.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        ctx.beginPath()

        // Simple size calculation
        const size =
          distance < maxDistance ? point.size * (1 + ((maxDistance - distance) / maxDistance) * 0.5) : point.size

        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)

        // Simple color with no gradients
        const alpha = distance < maxDistance ? 0.6 : 0.3
        ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`
        ctx.fill()
      }

      // Request next frame at lower frequency for better performance
      rafRef.current = setTimeout(() => {
        requestAnimationFrame(draw)
      }, 1000 / 30) // Cap at 30fps
    }

    // Initial setup
    resizeCanvas()
    window.addEventListener("resize", throttle(resizeCanvas, 200))
    window.addEventListener("mousemove", handleMouseMove)

    // Start animation loop
    rafRef.current = requestAnimationFrame(draw)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) clearTimeout(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }} />
}
