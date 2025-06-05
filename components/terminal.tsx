"use client"

import type React from "react"

import { useState, useEffect, useRef, memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Minus, Square } from "lucide-react"

interface TerminalProps {
  onClose: () => void
}

export const Terminal = memo(function Terminal({ onClose }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "Welcome to Alex's Portfolio Terminal!",
    'Type "help" to see available commands.',
    "",
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: () => [
      "Available commands:",
      "  about     - Learn about Alex",
      "  skills    - View technical skills",
      "  projects  - List featured projects",
      "  contact   - Get contact information",
      "  clear     - Clear terminal",
      "  exit      - Close terminal",
      "",
    ],
    about: () => [
      "Alex Johnson - Backend Developer & Cybersecurity Enthusiast",
      "",
      "Based in Mumbai, Maharashtra, India",
      "Passionate developer with 3+ years of experience",
      "Specializing in backend technologies and cybersecurity",
      "Currently seeking new opportunities",
      "",
    ],
    skills: () => [
      "Technical Skills:",
      "",
      "Backend: Node.js, Express, Python, PostgreSQL",
      "Security: Penetration Testing, Network Security, Cryptography",
      "DevOps: Docker, AWS, CI/CD, Kubernetes",
      "Tools: Git, Linux, Wireshark, Metasploit",
      "",
    ],
    projects: () => [
      "Featured Projects:",
      "",
      "1. Secure Authentication System - Node.js, JWT, 2FA",
      "2. Vulnerability Scanner - Python, Docker",
      "3. Encrypted Messaging App - End-to-end encryption",
      "",
      "Visit the projects section for more details!",
      "",
    ],
    contact: () => [
      "Contact Information:",
      "",
      "Email: alex@example.com",
      "Phone: +1 (555) 123-4567",
      "Location: Mumbai, Maharashtra, India",
      "GitHub: github.com/alex",
      "LinkedIn: linkedin.com/in/alex",
      "",
    ],
    clear: () => {
      setHistory(["Welcome to Alex's Portfolio Terminal!", 'Type "help" to see available commands.', ""])
      return []
    },
    exit: () => {
      onClose()
      return []
    },
  }

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()
    const output = commands[command as keyof typeof commands]

    if (output) {
      const result = output()
      if (result.length > 0) {
        setHistory((prev) => [...prev, `$ ${cmd}`, ...result])
      }
    } else if (command) {
      setHistory((prev) => [
        ...prev,
        `$ ${cmd}`,
        `Command not found: ${cmd}`,
        'Type "help" for available commands.',
        "",
      ])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-4xl h-full max-h-96"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <Card className="h-full bg-black/70 text-green-400 font-mono border-green-500/30 backdrop-blur-lg shadow-[0_0_25px_rgba(0,255,0,0.1)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <span className="text-sm">alex@portfolio:~$</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-green-400 hover:bg-green-400/20"
                  data-interactive="true"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-green-400 hover:bg-green-400/20"
                  data-interactive="true"
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-green-400 hover:bg-green-400/20"
                  onClick={onClose}
                  data-interactive="true"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full pt-0">
            <div
              ref={historyRef}
              className="flex-1 overflow-auto mb-4 space-y-1 text-sm hardware-accelerated smooth-scroll"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(34, 197, 94, 0.5) transparent",
              }}
            >
              {history.map((line, index) => (
                <div
                  key={index}
                  className={`${line.startsWith("$") ? "text-yellow-400" : "text-green-400"} ${
                    index === history.length - 1 ? "animate-gentle-pulse" : ""
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-yellow-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck="false"
                data-interactive="true"
              />
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
})
