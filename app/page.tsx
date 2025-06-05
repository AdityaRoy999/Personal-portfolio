"use client"

import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ProjectsSection } from "@/components/projects-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { AIChat } from "@/components/ai-chat"
import { CustomCursor } from "@/components/custom-cursor"
import { Terminal } from "@/components/terminal"
import { Preloader } from "@/components/preloader"
import { Button } from "@/components/ui/button"
import { SmoothScrollWrapper } from "@/components/smooth-scroll-wrapper"

// Memoize components that don't need frequent re-renders
const MemoizedHeroSection = memo(HeroSection)
const MemoizedTechStackSection = memo(TechStackSection)
const MemoizedProjectsSection = memo(ProjectsSection)
const MemoizedAboutSection = memo(AboutSection)
const MemoizedContactSection = memo(ContactSection)

export default function Portfolio() {
  const [funMode, setFunMode] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  // Use callbacks to prevent unnecessary re-renders
  const toggleFunMode = useCallback((value: boolean) => {
    setFunMode(value)
  }, [])

  const toggleTerminal = useCallback((value: boolean) => {
    setShowTerminal(value)
  }, [])

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SmoothScrollWrapper>
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
          {/* Preloader */}
          <AnimatePresence>{showPreloader && <Preloader onComplete={handlePreloaderComplete} />}</AnimatePresence>

          {/* Main content - only show after preloader */}
          <AnimatePresence>
            {!showPreloader && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Custom Cursor - always visible */}
                <CustomCursor />

                {/* Navbar with Fun Mode toggle */}
                <Navbar funMode={funMode} setFunMode={toggleFunMode} />

                {/* Terminal Toggle - only in fun mode */}
                <AnimatePresence>
                  {funMode && (
                    <motion.div
                      className="fixed bottom-6 left-6 z-50"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Button
                        onClick={() => toggleTerminal(!showTerminal)}
                        variant="outline"
                        size="lg"
                        className="rounded-full w-14 h-14 shadow-lg bg-black/50 backdrop-blur-sm border-green-500/30 hover:bg-green-500/20 transition-all duration-300"
                      >
                        💻
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="relative z-10">
                  <MemoizedHeroSection />
                  <MemoizedTechStackSection />
                  <MemoizedProjectsSection />
                  <MemoizedAboutSection />
                  <MemoizedContactSection />
                </main>

                {/* AI Chat - only in fun mode */}
                <AnimatePresence>{funMode && <AIChat />} </AnimatePresence>

                {/* Terminal - only in fun mode */}
                <AnimatePresence>
                  {funMode && showTerminal && <Terminal onClose={() => toggleTerminal(false)} />}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SmoothScrollWrapper>
    </ThemeProvider>
  )
}
