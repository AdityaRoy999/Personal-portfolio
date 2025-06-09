"use client"

import { useState, useEffect, memo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

// ✅ Enhanced ThemeBasedLogo component without shimmer and with faster animations
const ThemeBasedLogo = memo(function ThemeBasedLogo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show placeholder during hydration
  if (!mounted) {
    return (
      <div className="w-40 h-12 bg-muted/20 rounded animate-pulse" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <motion.div 
      className="relative w-40 h-12 overflow-hidden"
      whileHover={{ scale: 1.05 }} // ✅ Reduced from 1.08 to 1.05
      whileTap={{ scale: 0.98 }}   // ✅ Increased from 0.95 to 0.98
      transition={{ type: "spring", stiffness: 400, damping: 25 }} // ✅ Faster spring
    >
      <AnimatePresence>
        {isDark ? (
          <motion.img
            key="dark-logo"
            src="/dark mode.png"
            alt="Portfolio Logo"
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-lg"
            initial={{ 
              opacity: 0, 
              scale: 0.95, // ✅ Changed from 0.9 to 0.95 (less dramatic)
              rotate: -3,  // ✅ Changed from -5 to -3 (faster)
              y: 5,        // ✅ Changed from 10 to 5 (faster)
              filter: "blur(1px) brightness(0.8)" // ✅ Less blur
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: 0,
              filter: "blur(0px) brightness(1)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, // ✅ Changed from 0.9 to 0.95
              rotate: 3,   // ✅ Changed from 5 to 3
              y: -5,       // ✅ Changed from -10 to -5
              filter: "blur(1px) brightness(1.2)" // ✅ Less blur
            }}
            transition={{ 
              type: "spring", 
              stiffness: 800, // ✅ Increased from 800 to 1000
              damping: 25,     // ✅ Decreased from 20 to 15
              duration: 0.08   // ✅ Changed from 0.05 to 0.02
            }}
            whileHover={{
              filter: "brightness(1.1) contrast(1.05)",
              transition: { duration: 0.05 } // ✅ Faster hover transition
            }}
          />
        ) : (
          <motion.img
            key="light-logo"
            src="/light mode.png"
            alt="Portfolio Logo"
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-lg"
            initial={{ 
              opacity: 0, 
              scale: 0.95, // ✅ Changed from 0.9 to 0.95
              rotate: -3,  // ✅ Changed from -5 to -3
              y: 5,        // ✅ Changed from 10 to 5
              filter: "blur(1px) brightness(1.2)" // ✅ Less blur
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: 0,
              filter: "blur(0px) brightness(1)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, // ✅ Changed from 0.9 to 0.95
              rotate: 3,   // ✅ Changed from 5 to 3
              y: -5,       // ✅ Changed from -10 to -5
              filter: "blur(1px) brightness(0.8)" // ✅ Less blur
            }}
            transition={{ 
              type: "spring", 
              stiffness: 800, // ✅ Increased from 800 to 1000
              damping: 25,     // ✅ Decreased from 20 to 15
              duration: 0.08   // ✅ Changed from 0.05 to 0.02
            }}
            whileHover={{
              filter: "brightness(1.1) contrast(1.05)",
              transition: { duration: 0.05 } // ✅ Faster hover transition
            }}
          />
        )}
      </AnimatePresence>

      {/* ✅ REMOVED: Shimmer effect completely */}
    </motion.div>
  )
})

interface NavbarProps {
  funMode: boolean
  setFunMode: (value: boolean) => void
}

export const Navbar = memo(function Navbar({ funMode, setFunMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const isScrollingRef = useRef(false)

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Skills", href: "#tech-stack", id: "tech-stack" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "About", href: "#about", id: "about" },
    { name: "Contact", href: "#contact", id: "contact" }
  ]

  // ✅ Debounced and throttled scroll handler
  const handleScroll = useCallback(() => {
    // Don't update during programmatic scrolling
    if (isScrollingRef.current) return

    setIsScrolled(window.scrollY > 50)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Debounce the section detection
    scrollTimeoutRef.current = setTimeout(() => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(section => section.element)

      // More precise section detection
      let newActiveSection = "home"
      let maxVisibility = 0

      sections.forEach(section => {
        if (!section.element) return

        const rect = section.element.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Calculate visibility percentage
        const visibleTop = Math.max(0, -rect.top)
        const visibleBottom = Math.min(rect.height, windowHeight - rect.top)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const visibility = visibleHeight / windowHeight

        // Section in upper half of viewport gets priority
        const isInUpperHalf = rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3

        if (isInUpperHalf && visibility > maxVisibility) {
          maxVisibility = visibility
          newActiveSection = section.id
        }
      })

      setActiveSection(newActiveSection)
    }, 100) // 100ms debounce
  }, [navItems])

  // ✅ Throttled scroll listener
  useEffect(() => {
    let ticking = false

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    handleScroll() // Check initial position
    
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll])

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

    return () => {
      if (mainContent) {
        mainContent.style.filter = "none"
      }
      if (heroSection) {
        heroSection.style.filter = "none"
      }
    }
  }, [isMobileMenuOpen])

  // ✅ Improved scroll to section with smooth transition
  const scrollToSection = useCallback((href: string, sectionId: string) => {
    const element = document.querySelector(href)
    if (element) {
      // Prevent scroll detection during programmatic scroll
      isScrollingRef.current = true
      
      // Update active section immediately for instant visual feedback
      setActiveSection(sectionId)
      
      // Smooth scroll to section
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })

      // Re-enable scroll detection after scr oll completes
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000) // Allow 1 second for scroll to complete
    }
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        }`} // ✅ Removed transition-all duration-300
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400,  // ✅ Increased from 300 to 400
          damping: 25,     // ✅ Reduced from 30 to 25
          duration: 0.6    // ✅ Added specific duration
        }}
      >
        <div className="container mx-auto px-2 py-4"> {/* ✅ Reduced padding from px-4 to px-2 */}
          <div className="flex items-center justify-between">
            {/* ✅ Enhanced Logo with better positioning */}
            {/* ✅ Added negative margin to push logo further left */}
            <motion.div
              className="cursor-pointer flex-shrink-0 -ml-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => scrollToSection("#home", "home")}
            >
              <ThemeBasedLogo />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-end"> {/* ✅ Added flex-1 justify-end for better spacing */}
              {navItems.map((item, index) => (
                <motion.div key={item.name} className="relative">
                  <motion.button
                    onClick={() => scrollToSection(item.href, item.id)}
                    className={`relative transition-colors duration-200 px-3 py-2 ${
                      activeSection === item.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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

                  {/* ✅ Smooth active section indicator */}
                  <AnimatePresence>
                    {activeSection === item.id && (
                      <motion.div
                        className="absolute -bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                        layoutId="navbar-indicator"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          duration: 0.3
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* ✅ Subtle glow effect */}
                  <AnimatePresence>
                    {activeSection === item.id && (
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Fun Mode Button */}
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
              

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative overflow-hidden w-10 h-10 p-0"
              >
                <motion.div
                  className="relative w-5 h-5 flex flex-col justify-center items-center"
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* Top line */}
                  <motion.span
                    className="absolute w-5 h-0.5 bg-current rounded-full"
                    variants={{
                      closed: { rotate: 0, y: -6, opacity: 1 },
                      open: { rotate: 45, y: 0, opacity: 1 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  
                  {/* Middle line */}
                  <motion.span
                    className="absolute w-5 h-0.5 bg-current rounded-full"
                    variants={{
                      closed: { opacity: 1, x: 0, rotate: 0 },
                      open: { opacity: 0, x: -10, rotate: 180 }
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                  
                  {/* Bottom line */}
                  <motion.span
                    className="absolute w-5 h-0.5 bg-current rounded-full"
                    variants={{
                      closed: { rotate: 0, y: 6, opacity: 1 },
                      open: { rotate: -45, y: 0, opacity: 1 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatedMobileMenu 
            isOpen={isMobileMenuOpen} 
            navItems={navItems} 
            activeSection={activeSection}
            onItemClick={scrollToSection} 
          />
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
            transition={{ duration: 0.1 }} // ✅ Reduced from 0.3 to 0.1
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
})

// ✅ Much faster mobile menu animation
const AnimatedMobileMenu = memo(function AnimatedMobileMenu({
  isOpen,
  navItems,
  activeSection,
  onItemClick,
}: {
  isOpen: boolean
  navItems: Array<{ name: string; href: string; id: string }>
  activeSection: string
  onItemClick: (href: string, id: string) => void
}) {
  if (!isOpen) return null

  return (
    <motion.div
      className="md:hidden mt-4 pb-4 border-t relative z-50"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 700, // ✅ Increased from 500 to 700
        damping: 15,    // ✅ Decreased from 20 to 15
        duration: 0.1   // ✅ Reduced from 0.15 to 0.1
      }}
    >
      <div className="flex flex-col space-y-4 pt-4">
        {navItems.map((item, index) => (
          <motion.div key={item.name} className="relative">
            <motion.button
              onClick={() => onItemClick(item.href, item.id)}
              className={`text-left transition-all duration-200 w-full py-2 px-4 rounded-lg ${
                activeSection === item.id
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.015, // ✅ Reduced delay from 0.02 to 0.015
                duration: 0.08        // ✅ Reduced from 0.12 to 0.08
              }}
              whileTap={{ scale: 0.98 }}
            >
              {item.name}
            </motion.button>
            
            {/* ✅ Smooth mobile active indicator */}
            <AnimatePresence>
              {activeSection === item.id && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  layoutId="mobile-navbar-indicator"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
})
