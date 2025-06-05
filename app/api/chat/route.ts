import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

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

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, attachments } = await request.json()

    if (!message && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: "Message or attachments are required" }, { status: 400 })
    }

    // Use the environment variable
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Comprehensive context about Aditya's and the portfolio
    const portfolioContext = `You are Aditya Roy's AI assistant. Here's comprehensive information about Aditya and his portfolio:

PERSONAL INFORMATION:
- Name: Aditya Roy
- Location: Mumbai, Maharashtra, India
- Role: Backend Developer and Cybersecurity Enthusiast
- Experience: 1.5+ years in software development
- Current Status: Actively seeking opportunities as a Backend Developer or Security Engineer

TECHNICAL SKILLS:
Frontend Technologies:
- React 
- Next.js 
- TypeScript 
- Javascript
- Python

Backend Technologies:
- node.js 
- Python 
- MySQL 

DevOps & Tools:
- Git 
- Docker 
- Google Cloud
- Vercel 
- Figma 

AI/ML & Security:
- OpenAI API 
- TensorFlow 
- Jupyter 
- Penetration Testing
- Network Security
- Cryptography
- Vulnerability Assessment

FEATURED PROJECTS:

1. Datawiz

- Full-stack web application providing a user-friendly interface to visualize data from CSV files.
- Users can upload a CSV file, choose different types of plots, and customize their data visualization experience.
- Technologies: Python, Streamlit
2. NetNinja

- All-in-one security toolkit for the digital age, designed to help users protect, encrypt, and secure their digital assets with ease.
- Technologies: Streamlit, Python, Custom CSS

3. Emergency Ward System

- Full-stack web application that efficiently manages critical patient data, doctor assignments, accessories, instruments and real-time updates for emergency care.
Streamlines hospital workflow, ensuring quick and accurate treatment during medical emergencies.
- Status: In progress

CONTACT INFORMATION:
- Email: adiroyboy2@gmail.com
- Phone: +91 99099 99099
- GitHub: github.com/AdityaRoy999
- LinkedIn: linkedin.com/in/aditya-roy-0492ab26b
- Availability: Open to new opportunities and exciting projects

ABOUT ADITYA:
Aditya is a backend developer with over 1.5+ years of experience creating web applications that solve real-world problems. His journey started with curiosity about how websites work and evolved into a deep love for crafting beautiful, functional, and user-friendly digital experiences.

He specializes in React, Next.js, and modern web technologies, with a strong focus on performance, accessibility, and user experience. Aditya is particularly interested in cybersecurity and has 1.5+ years of experience.

Aditya is always eager to learn new technologies and take on challenging projects that push the boundaries. He's currently seeking opportunities where he can contribute to meaningful projects and continue growing as a developer.

FILE ANALYSIS CAPABILITIES:
You can analyze various file types:
- Images: Describe content, extract text, analyze visual elements
- PDFs: Extract and analyze text content, summarize documents
- Text files: Analyze content, provide insights, answer questions
- DOCX files: Extract and analyze document content

INSTRUCTIONS:
- You can answer questions about Aditya's background, skills, projects, and experience
- You can also engage in general conversations about technology, programming, cybersecurity, or any other topics
- When files are attached, analyze them thoroughly and provide detailed insights
- For images, describe what you see and extract any text if present
- For documents, summarize content and answer specific questions about them
- Be helpful, professional, and conversational
- If asked about specific projects, provide details from the information above
- If asked about contact information, provide the details listed above
- Feel free to discuss general topics beyond just Aditya's portfolio
- Remember previous messages in the conversation for context`

    // Build conversation context from history
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 1) {
      conversationContext = "\n\nPREVIOUS CONVERSATION:\n"
      // Include last 10 messages for context (excluding the current one)
      const recentMessages = conversationHistory.slice(-11, -1)
      recentMessages.forEach((msg: Message) => {
        const sender = msg.sender === "user" ? "User" : "Assistant"
        conversationContext += `${sender}: ${msg.text}\n`
        if (msg.attachments && msg.attachments.length > 0) {
          conversationContext += `Attachments: ${msg.attachments.map((att) => att.name).join(", ")}\n`
        }
      })
    }

    // Prepare the content parts for Gemini API
    const contentParts: any[] = []

    // Add text content
    let fullPrompt = `${portfolioContext}${conversationContext}\n\nCurrent User Message: ${message || "User has attached files for analysis"}`

    if (attachments && attachments.length > 0) {
      fullPrompt += `\n\nATTACHED FILES (${attachments.length}):\n`

      attachments.forEach((attachment: FileAttachment, index: number) => {
        fullPrompt += `\nFile ${index + 1}: ${attachment.name} (${attachment.type}, ${attachment.size} bytes)\n`

        if (attachment.type.startsWith("image/") && attachment.content) {
          // For images, add both text description and the image data
          fullPrompt += `Please analyze this image and describe what you see.\n`

          // Add image data to content parts
          const base64Data = attachment.content.split(",")[1] // Remove data:image/...;base64, prefix
          contentParts.push({
            inlineData: {
              mimeType: attachment.type,
              data: base64Data,
            },
          })
        } else if (attachment.type === "text/plain" || attachment.type === "text/csv") {
          // For text files, include the content directly
          fullPrompt += `Content:\n${attachment.content}\n`
        } else if (attachment.type === "application/pdf" || attachment.type.includes("word")) {
          // For PDFs and DOCX, we'll need to handle them differently
          // For now, we'll indicate that the file was uploaded
          fullPrompt += `Please note: This ${attachment.type.includes("pdf") ? "PDF" : "Word"} document has been uploaded. Please let the user know that you can see the file but may need them to copy and paste specific content for detailed analysis.\n`
        }
      })
    }

    fullPrompt += `\n\nPlease provide a helpful response. If files are attached, analyze them thoroughly. If the question is about Aditya's portfolio, use the information provided above. For general questions, feel free to engage in normal conversation while maintaining your role as Aditya's AI assistant.`

    // Add text content as the first part
    contentParts.unshift({
      text: fullPrompt,
    })

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: contentParts,
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API Error:", errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response format from Gemini API")
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to get AI response. Please try again." }, { status: 500 })
  }
}
