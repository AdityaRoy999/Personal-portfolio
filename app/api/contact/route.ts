import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Get Formspree endpoint from environment variable
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT

    if (!formspreeEndpoint) {
      console.error("FORMSPREE_ENDPOINT environment variable is not set")
      return NextResponse.json({ error: "Contact form configuration error" }, { status: 500 })
    }

    // Submit to Formspree
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Message sent successfully!" })
    } else {
      const errorData = await response.text()
      console.error("Formspree error:", errorData)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
