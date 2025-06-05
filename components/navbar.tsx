"use client"

import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Sparkles } from "lucide-react"

interface NavbarProps {
  funMode: boolean
  setFunMode: (value: boolean) => void
}

export const Navbar = memo(function Navbar({ funMode, setFunMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Add/remove blur effect when mobile menu is open
  useEffect(() => {
    const mainContent = document.querySelector("main") as HTMLElement | null
    const heroSection = document.querySelector("#home") as HTMLElement | null

    if (isMobileMenuOpen) {
      if (mainContent) {
        mainContent.style.filter = "blur(8px)"
        mainContent.style.transition = "filter 0.3s ease-in-out"
      }
      if (heroSection) {
        heroSection.style.filter = "blur(8px)"
        heroSection.style.transition = "filter 0.3s ease-in-out"
      }
    } else {
      if (mainContent) {
        mainContent.style.filter = "none"
      }
      if (heroSection) {
        heroSection.style.filter = "none"
      }
    }

    // Cleanup on unmount
    return () => {
      if (mainContent) {
        mainContent.style.filter = "none"
      }
      if (heroSection) {
        heroSection.style.filter = "none"
      }
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      // Use native scrollIntoView for instant response
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Portfolio
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: index * 0.05,
                  }}
                >
                  {item.name}
                </motion.button>
              ))}

              {/* Fun Mode Button in navbar */}
              <Button
                onClick={() => setFunMode(!funMode)}
                variant={funMode ? "default" : "outline"}
                size="sm"
                className={`gap-2 transition-all duration-300 ${
                  funMode
                    ? "bg-primary/80 text-primary-foreground shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                    : "hover:bg-primary/20"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${funMode ? "animate-pulse" : ""}`} />
                {funMode ? "Exit Fun Mode" : "Fun Mode"}
              </Button>

              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Fun Mode Button for mobile */}
              <Button
                onClick={() => setFunMode(!funMode)}
                variant={funMode ? "default" : "outline"}
                size="icon"
                className={`w-8 h-8 transition-all duration-300 ${
                  funMode ? "bg-primary/80 text-primary-foreground shadow-[0_0_15px_rgba(147,51,234,0.5)]" : ""
                }`}
              >
                <Sparkles className={`h-4 w-4 ${funMode ? "animate-pulse" : ""}`} />
              </Button>

              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatedMobileMenu isOpen={isMobileMenuOpen} navItems={navItems} onItemClick={scrollToSection} />
        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
})

// Separate component for mobile menu to optimize rendering
const AnimatedMobileMenu = memo(function AnimatedMobileMenu({
  isOpen,
  navItems,
  onItemClick,
}: {
  isOpen: boolean
  navItems: Array<{ name: string; href: string }>
  onItemClick: (href: string) => void
}) {
  if (!isOpen) return null

  return (
    <motion.div
      className="md:hidden mt-4 pb-4 border-t relative z-50"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col space-y-4 pt-4">
        {navItems.map((item, index) => (
          <motion.button
            key={item.name}
            onClick={() => onItemClick(item.href)}
            className="text-left text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
})
