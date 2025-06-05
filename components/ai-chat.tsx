"use client"

import type React from "react"

import { useState, useRef, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Mic,
  MicOff,
  Download,
  MoreVertical,
  Paperclip,
  FileText,
  ImageIcon,
  FileX,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  attachments?: FileAttachment[]
}

interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  content?: string
  url?: string
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export const AIChat = memo(function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Aditya's AI assistant . I can help you learn about Aditya's skills, projects, and experience, or we can chat about anything else you'd like to know! You can type, use the microphone, or attach files (images, PDFs, text, DOCX) for me to analyze.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 320, height: 384 }) // default w-80 (320px) and h-96 (384px)
  const [isResizing, setIsResizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resizeStartPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStartDimensionsRef = useRef<{ width: number; height: number }>({ width: 320, height: 384 })
  const { toast } = useToast()

  // Initialize speech recognition with better error handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()

        // Configure recognition settings
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log("Speech recognition started")
          setIsListening(true)
        }

        recognition.onresult = (event: any) => {
          console.log("Speech recognition result:", event)
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setInputValue(finalTranscript.trim())
            setIsListening(false)
          } else if (interimTranscript) {
            setInputValue(interimTranscript)
          }
        }

        recognition.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)

          let errorMessage = "Speech recognition failed. Please try again."

          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please speak clearly and try again."
              break
            case "audio-capture":
              errorMessage = "Microphone not found. Please check your microphone connection."
              break
            case "not-allowed":
              errorMessage = "Microphone access denied. Please allow microphone permissions and try again."
              break
            case "network":
              errorMessage = "Speech recognition requires an internet connection. Please check your connection."
              break
            case "service-not-allowed":
              errorMessage = "Speech recognition service not available. Please try typing your message."
              break
            case "bad-grammar":
              errorMessage = "Speech recognition error. Please try speaking more clearly."
              break
            case "language-not-supported":
              errorMessage = "Language not supported. Please try typing your message."
              break
            default:
              errorMessage = `Speech recognition error (${event.error}). Please try typing your message.`
          }

          toast({
            title: "Voice Input Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        recognitionRef.current = recognition
      } else {
        console.log("Speech recognition not supported")
        setSpeechSupported(false)
      }
    }
  }, [toast])

  const startListening = () => {
    if (!speechSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please type your message instead.",
        variant: "destructive",
      })
      return
    }

    if (recognitionRef.current) {
      try {
        setInputValue("")
        recognitionRef.current.start()
        console.log("Starting speech recognition...")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        toast({
          title: "Voice Input Error",
          description: "Could not start voice input. Please try again or type your message.",
          variant: "destructive",
        })
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        console.log("Stopping speech recognition...")
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }

  // File processing functions
  const processTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const processImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const processPDFFile = async (file: File): Promise<string> => {
    // For PDF files, we'll convert to base64 and let the API handle extraction
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const processDOCXFile = async (file: File): Promise<string> => {
    // For DOCX files, we'll convert to base64 and let the API handle extraction
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsProcessingFile(true)

    try {
      const newAttachments: FileAttachment[] = []

      for (const file of Array.from(files)) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: `${file.name} is too large. Maximum file size is 10MB.`,
            variant: "destructive",
          })
          continue
        }

        // Check file type
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "text/plain",
          "text/csv",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Unsupported File Type",
            description: `${file.name} is not supported. Please use images, PDFs, text files, or DOCX files.`,
            variant: "destructive",
          })
          continue
        }

        let content = ""
        let url = ""

        try {
          if (file.type.startsWith("image/")) {
            content = await processImageFile(file)
            url = content
          } else if (file.type === "application/pdf") {
            content = await processPDFFile(file)
          } else if (file.type === "text/plain" || file.type === "text/csv") {
            content = await processTextFile(file)
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            content = await processDOCXFile(file)
          }

          const attachment: FileAttachment = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            content,
            url: file.type.startsWith("image/") ? content : undefined,
          }

          newAttachments.push(attachment)
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error)
          toast({
            title: "File Processing Error",
            description: `Could not process ${file.name}. Please try again.`,
            variant: "destructive",
          })
        }
      }

      setAttachments((prev) => [...prev, ...newAttachments])

      if (newAttachments.length > 0) {
        toast({
          title: "Files Attached",
          description: `${newAttachments.length} file(s) attached successfully.`,
        })
      }
    } catch (error) {
      console.error("Error handling file selection:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing the files.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingFile(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />
    if (type.includes("word")) return <FileText className="h-4 w-4 text-blue-500" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const callGeminiAPI = async (
    userMessage: string,
    conversationHistory: Message[],
    attachments: FileAttachment[],
  ): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
          attachments: attachments,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || "I'm sorry, I couldn't process your request right now. Please try again."
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "I'm experiencing some technical difficulties. Please try again in a moment."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue || (attachments.length > 0 ? "📎 Attached files" : ""),
      sender: "user",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    const currentInput = inputValue
    const currentAttachments = [...attachments]
    setInputValue("")
    setAttachments([])
    setIsTyping(true)

    try {
      const aiResponse = await callGeminiAPI(currentInput, updatedMessages, currentAttachments)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const exportChat = () => {
    const chatData = {
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      conversation: messages.map((msg) => ({
        sender: msg.sender,
        message: msg.text,
        timestamp: msg.timestamp.toISOString(),
        attachments: msg.attachments?.map((att) => ({
          name: att.name,
          type: att.type,
          size: att.size,
        })),
      })),
    }

    const dataStr = JSON.stringify(chatData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `alex-portfolio-chat-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded as a JSON file.",
    })
  }

  const exportChatAsText = () => {
    let textContent = `Alex Johnson Portfolio - AI Chat Conversation\n`
    textContent += `Exported on: ${new Date().toLocaleString()}\n`
    textContent += `Total Messages: ${messages.length}\n`
    textContent += `${"=".repeat(50)}\n\n`

    messages.forEach((msg) => {
      const timestamp = msg.timestamp.toLocaleString()
      const sender = msg.sender === "user" ? "You" : "AI Assistant"
      textContent += `[${timestamp}] ${sender}:\n${msg.text}\n`

      if (msg.attachments && msg.attachments.length > 0) {
        textContent += `Attachments: ${msg.attachments.map((att) => att.name).join(", ")}\n`
      }

      textContent += `\n`
    })

    const dataBlob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `alex-portfolio-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded as a text file.",
    })
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Aditya's AI assistant . I can help you learn about Aditya's skills, projects, and experience, or we can chat about anything else you'd like to know! You can type, use the microphone, or attach files (images, PDFs, text, DOCX) for me to analyze.",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
    setAttachments([])
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been cleared.",
    })
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Load saved dimensions from localStorage
  useEffect(() => {
    const savedSize = localStorage.getItem('chatWindowSize')
    if (savedSize) {
      try {
        const parsedSize = JSON.parse(savedSize)
        setWindowSize(parsedSize)
      } catch (e) {
        console.error('Failed to parse saved chat window size', e)
      }
    }
  }, [])

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    
    // Get starting position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    resizeStartPositionRef.current = { x: clientX, y: clientY }
    resizeStartDimensionsRef.current = { ...windowSize }
    setIsResizing(true)
    
    // Add event listeners with capture option for better reliability
    document.addEventListener('mousemove', handleResize, { capture: true })
    document.addEventListener('touchmove', handleResize, { capture: true })
    document.addEventListener('mouseup', handleResizeEnd, { capture: true })
    document.addEventListener('touchend', handleResizeEnd, { capture: true })
  }
  
  // Handle resize
  const handleResize = (e: MouseEvent | TouchEvent) => {
    if (!isResizing) return
    
    e.preventDefault() // Prevent default behaviors
    
    // Get current position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    // Calculate delta (how much the mouse/finger has moved)
    const deltaX = clientX - resizeStartPositionRef.current.x
    const deltaY = clientY - resizeStartPositionRef.current.y
    
    // When resizing from top-left, negative delta means increase size
    const newWidth = Math.max(280, Math.min(600, resizeStartDimensionsRef.current.width - deltaX))
    const newHeight = Math.max(300, Math.min(800, resizeStartDimensionsRef.current.height - deltaY))
    
    // Force a state update
    setWindowSize({ width: newWidth, height: newHeight })
    
    // Optional: Show dimensions in console for debugging
    console.log(`Resizing: ${newWidth}px × ${newHeight}px`)
  }
  
  // Handle resize end
  const handleResizeEnd = () => {
    if (!isResizing) return
  
    setIsResizing(false)
    
    // Save dimensions to localStorage
    try {
      localStorage.setItem('chatWindowSize', JSON.stringify(windowSize))
    } catch (e) {
      console.error('Failed to save chat window size', e)
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResize, { capture: true })
    document.removeEventListener('touchmove', handleResize, { capture: true })
    document.removeEventListener('mouseup', handleResizeEnd, { capture: true })
    document.removeEventListener('touchend', handleResizeEnd, { capture: true })
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.csv,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg transition-transform duration-300 hover:scale-105"
          data-interactive="true"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            style={{ 
              width: `${windowSize.width}px`, 
              height: `${windowSize.height}px` 
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Resize handle - top left corner */}
            <div
              className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-20 touch-manipulation"
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            >
              <div className="absolute top-1 left-1 w-4 h-4 bg-primary/50 hover:bg-primary/80 rounded-sm flex items-center justify-center transition-colors">
                <span className="text-[8px] text-white/80">↔</span>
              </div>
            </div>
            
            <Card className="h-full flex flex-col shadow-xl border-primary/20 overflow-hidden relative">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Assistant
                    {/*
                    <div className="flex gap-1">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Gemini 2.0</span>
                    </div>
                    */}
                        {/* Show "Voice" badge if speech recognition is supported */}
                        {/*
                        {speechSupported && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">🎤 Voice</span>
                        )}
                        */}
                        {/* Always show "Files" badge */}
                        {/*
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">📎 Files</span>
                        */}
                    {/*</div>*/}
                  </CardTitle>

                  {/* Chat Options Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-interactive="true">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportChat} data-interactive="true">
                        <Download className="h-4 w-4 mr-2" />
                        Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportChatAsText} data-interactive="true">
                        <Download className="h-4 w-4 mr-2" />
                        Export as Text
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={clearChat} data-interactive="true">
                        <X className="h-4 w-4 mr-2" />
                        Clear Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-2 space-y-4 min-h-0 smooth-scroll"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
                    scrollBehavior: "smooth",
                  }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[85%] ${
                          message.sender === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`p-1 rounded-full flex-shrink-0 ${message.sender === "user" ? "bg-primary" : "bg-muted"}`}
                        >
                          {message.sender === "user" ? (
                            <User className="h-3 w-3 text-primary-foreground" />
                          ) : (
                            <Bot className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg break-words ${
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

                          {/* Display attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center gap-2 p-2 bg-black/10 rounded text-xs"
                                >
                                  {getFileIcon(attachment.type)}
                                  <div className="flex-1 min-w-0">
                                    <div className="truncate font-medium">{attachment.name}</div>
                                    <div className="text-xs opacity-70">{formatFileSize(attachment.size)}</div>
                                  </div>
                                  {attachment.url && attachment.type.startsWith("image/") && (
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* AI Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-1 rounded-full bg-muted flex-shrink-0">
                            <Bot className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-muted-foreground mb-1">Gemini is analyzing...</div>
                              <div className="flex items-center gap-1">
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                  animate={{
                                    scale: [0.5, 1, 0.5],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                  }}
                                />
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                  animate={{
                                    scale: [0.5, 1, 0.5],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    delay: 0.2,
                                  }}
                                />
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                  animate={{
                                    scale: [0.5, 1, 0.5],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    delay: 0.4,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Voice Listening Indicator */}
                  <AnimatePresence>
                    {isListening && (
                      <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-3 h-3 bg-red-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                            <span className="text-sm text-red-400 font-medium">🎤 Listening...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="px-4 py-2 border-t bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-2">Attachments ({attachments.length})</div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-1 bg-background rounded text-xs">
                          {getFileIcon(attachment.type)}
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAttachment(attachment.id)}
                            className="h-6 w-6 p-0"
                            data-interactive="true"
                          >
                            <FileX className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area with Voice Input and File Attachment */}
                <div className="p-4 border-t flex-shrink-0">
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isListening ? "🎤 Listening..." : "Ask me anything, attach files, or use voice..."}
                      className="flex-1"
                      data-interactive="true"
                      disabled={isTyping || isProcessingFile}
                    />

                    {/* File Attachment Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isTyping || isProcessingFile}
                      data-interactive="true"
                      className="hover:bg-primary/20"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* Voice Input Button */}
                    {speechSupported && (
                      <Button
                        type="button"
                        size="sm"
                        variant={isListening ? "destructive" : "outline"}
                        onClick={isListening ? stopListening : startListening}
                        disabled={isTyping || isProcessingFile}
                        data-interactive="true"
                        className={`transition-all duration-200 ${
                          isListening
                            ? "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                            : "hover:bg-primary/20"
                        }`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    )}

                    {/* Send Button */}
                    <Button
                      type="submit"
                      size="sm"
                      data-interactive="true"
                      disabled={isTyping || isProcessingFile || (!inputValue.trim() && attachments.length === 0)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* File Processing Indicator */}
                  {isProcessingFile && (
                    <div className="text-xs text-muted-foreground mt-2 text-center">📎 Processing files...</div>
                  )}

                  {/* Voice Input Hint */}
                  {speechSupported && !isListening && !isProcessingFile && (
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      💡 Click 🎤 for voice, 📎 for files (images, PDFs, text, DOCX)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }

        /* Styles for resize handle */
        .cursor-nwse-resize {
          cursor: nwse-resize;
        }
      `}</style>
    </>
  )
})
