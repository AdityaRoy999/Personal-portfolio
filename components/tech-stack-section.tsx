"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List, Box } from "lucide-react"
import Image from "next/image"
import NeuralNetworkViz from "@/components/NeuralNetworkViz"


export function TechStackSection() {
  const [viewMode, setViewMode] = useState<"list" | "neural">("list")
  
  const techStack = {
    Frontend: [
      {
        name: "React",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "Python",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "TypeScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "JavaScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
    ],
    Backend: [
      {
        name: "Node.js",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Python",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "MySQL",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
    ],
    DevTools: [
      {
        name: "Git",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "Docker",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
      {
        name: "Google Cloud",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      },
      {
        name: "Vercel",
        logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
      },
      {
        name: "Figma",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
    ],
    "AI/ML": [
      {
        name: "OpenAI API",
        logo: "/Chat.svg",
      },
      {
        name: "TensorFlow",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
      },
      {
        name: "PyTorch",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
      },
      {
        name: "Jupyter",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
      },
    ],
  }

  const handleViewModeChange = (mode: "list" | "neural") => {
    // Store current scroll position
    const scrollPos = window.scrollY;
    
    // Update state immediately
    setViewMode(mode);
    
    // For neural network, don't try to restore scroll immediately
    if (mode === "neural") {
      // Just let it render naturally
      return;
    }
    
    // For list view, restore scroll position
    setTimeout(() => {
      window.scrollTo({
        top: scrollPos,
        behavior: 'auto'
      });
    }, 10);
  };

  return (
    <section id="tech-stack" className="py-20 bg-background"> {/* ✅ Added id="tech-stack" */}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tech Stack & Skills
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive collection of technologies, frameworks, and tools I use to build modern applications
          </p>
          
          {/* Usage Instructions for Neural Network */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground/70 bg-muted/20 rounded-lg px-4 py-2 inline-block border border-muted/30">
              <span className="text-yellow-400 font-medium">Note:</span> For 3D view, click "3D View"→"Scroll down"→"Click List view and 3D View" [works best on Laptops and Desktops]
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-muted/20 p-1 rounded-lg border border-muted/30 flex"> {/* Added flex here */}
              <button
                onClick={() => handleViewModeChange("list")}
                className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
                List View
              </button>
              <button
                onClick={() => handleViewModeChange("neural")}
                className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  viewMode === "neural"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Box size={16} />
                3D View
              </button>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {Object.entries(techStack).map(([category, skills], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }} // Changed
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-center">{category}</h3>
                      <div className="space-y-3">
                        {skills.map((skill, index) => (
                          <motion.div
                            key={skill.name}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }} // Changed
                            transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              <Image
                                src={skill.logo || "/placeholder.svg"}
                                alt={`${skill.name} logo`}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback to a generic icon if logo fails to load
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=32&width=32"
                                }}
                              />
                            </div>
                            <span className="font-medium">{skill.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="neural-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-[80vh] min-h-[600px] rounded-xl overflow-hidden border border-muted/20 bg-muted/5"
            >
              <NeuralNetworkViz techStack={techStack} className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
