"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9">
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 overflow-hidden"
    >
      <motion.div
        className="relative w-4 h-4"
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.4
        }}
      >
        {/* ✅ Removed mode="wait" and used overlapping animations */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.3
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-4 w-4" />
            </motion.div>
          )}
          
          {!isDark && (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.3
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ✅ Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          backgroundColor: isDark 
            ? "rgba(59, 130, 246, 0.1)" 
            : "rgba(251, 191, 36, 0.1)"
        }}
        transition={{ duration: 0.3 }}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
