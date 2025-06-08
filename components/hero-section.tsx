"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Twitter } from "lucide-react"
import { GraphBackground } from "@/components/graph-background"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

// Component for individual letter animation
const AnimatedLetter = ({ letter, index }: { letter: string; index: number }) => {
  return (
    <motion.span
      className="inline-block"
      whileHover={{
        scale: 1.3,
        y: -8,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
        duration: 0.2,
      }}
      style={{
        display: letter === " " ? "inline" : "inline-block",
        minWidth: letter === " " ? "0.3em" : "auto",
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  )
}

// Component for the name with special gradient effect (keeping original colors)
const AnimatedName = ({ text }: { text: string }) => {
  return (
    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          whileHover={{
            scale: 1.4,
            y: -10,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 12,
            duration: 0.15,
          }}
          style={{
            display: letter === " " ? "inline" : "inline-block",
            minWidth: letter === " " ? "0.3em" : "auto",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  )
}

export function HeroSection() {
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Track screen dimensions and ensure proper re-rendering
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial setup
    updateDimensions()
    setMounted(true)

    // Listen for resize events
    window.addEventListener("resize", updateDimensions)
    window.addEventListener("orientationchange", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      window.removeEventListener("orientationchange", updateDimensions)
    }
  }, [])

  const scrollToProjects = () => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  const hiImText = "Hi, I'm "

  // Render heading with proper responsive behavior
  const renderHeading = () => {
    if (!mounted) {
      // Fallback during hydration
      return (
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span>Hi, I'm </span>
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Aditya</span>
        </h1>
      )
    }

    if (isMobile) {
      return (
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          <div className="mb-2">Hi, I'm</div>
          <div className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Aditya</div>
        </h1>
      )
    }

    return (
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        {hiImText.split("").map((letter, index) => (
          <AnimatedLetter key={index} letter={letter} index={index} />
        ))}
        <AnimatedName text="Aditya" />
      </h1>
    )
  }

  return (
    <section
      id="home"
      className="min-h-screen w-full flex items-start justify-center relative overflow-hidden pt-24 sm:pt-32 lg:pt-20"
      style={{ minHeight: "100dvh" }} // Use dynamic viewport height
    >
      {/* Graph Background */}
      <div className="absolute inset-0 z-0">
        <GraphBackground />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center lg:justify-items-start">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left w-full max-w-2xl lg:max-w-none"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
            transition={{ duration: 0.8 }}
            key={`content-${dimensions.width}-${dimensions.height}`}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 0.2 }}
            >
              {renderHeading()}
            </motion.div>

            <motion.div
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 0.4 }}
            >
              Backend Developer and Cybersecurity Enthusiast
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 0.5 }}
            >
              I am from Mumbai, Maharashtra, India
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 0.6 }}
            >
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 0.8 }}
            >
              <Button onClick={scrollToProjects} size="lg" className="group">
                View My Work
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button onClick={scrollToContact} variant="outline" size="lg">
                Get In Touch
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
              transition={{ delay: 1 }}
            >
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/AdityaRoy999" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://www.linkedin.com/in/aditya-roy-0492ab26b/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://x.com/ANONYMOUS43580?t=KVC81gO0-hizpcPeRboUyQ&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:adiroyboy2@gmail.com">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Profile Image Section */}
          <motion.div
            className="flex justify-center lg:justify-end w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} // ✅ Re-animates on scroll
            transition={{ delay: 0.4, duration: 0.8 }}
            key={`image-${dimensions.width}-${dimensions.height}`}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-full lg:h-96 max-w-md lg:max-w-none rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-sm border border-primary/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
                <div className="relative w-full h-full">
                  <img
                    src="/aditya.jpg?height=400&width=400"
                    alt="Aditya Roy - Backend Developer"
                    className="w-full h-full object-cover rounded-xl shadow-2xl"
                  />
                  {/* Optional overlay for better visual effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
