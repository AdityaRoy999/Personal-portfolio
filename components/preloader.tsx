"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const greetings = [
  { text: "Hello", lang: "English" },
  { text: "नमस्ते", lang: "Hindi" },
  { text: "Hola", lang: "Spanish" },
  { text: "Bonjour", lang: "French" },
  { text: "こんにちは", lang: "Japanese" },
]

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if preloader has already been shown in this session
    const hasShownPreloader = sessionStorage.getItem("preloader-shown")

    if (hasShownPreloader) {
      // Skip preloader if already shown
      setIsVisible(false)
      onComplete()
      return
    }

    // Show each greeting for 1000ms
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < greetings.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          // Wait a bit after the last greeting, then fade out
          setTimeout(() => {
            setIsVisible(false)
            // Mark preloader as shown for this session
            sessionStorage.setItem("preloader-shown", "true")
            setTimeout(onComplete, 500) // Wait for fade out animation
          }, 1200)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <span className="text-4xl">👋</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="text-center"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                {greetings[currentIndex].text}
              </h1>
              <p className="text-muted-foreground text-lg">{greetings[currentIndex].lang}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="mt-12 flex justify-center space-x-2">
            {greetings.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${index <= currentIndex ? "bg-primary" : "bg-muted"}`}
                initial={{ scale: 0 }}
                animate={{ scale: index <= currentIndex ? 1 : 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.p
            className="mt-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Welcome to my portfolio
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
