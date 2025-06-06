"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

export function ProjectsSection() {
  const projects = [
    {
      title: "Datawiz",
      description:
        "DataWiz is a fullstack web application which provides a user-friendly interface to visualize data from CSV files. Users can upload a CSV file, choose different types of plots, and customize their data visualization experience. profiles.",
      image: "/p1.png?height=300&width=500",
      tech: ["Python", "Streamlit"],
      liveUrl: "https://datawiz-in.streamlit.app/",
      githubUrl: "https://github.com/AdityaRoy999/DataWiz",
      featured: true,
    },
    {
      title: "NetNinja",
      description: "NetNinja is an all-in-one security toolkit for the digital age, designed to help users protect, encrypt, and secure their digital assets with ease.",
      image: "/p2.png?height=300&width=500",
      tech: ["Streamlit", "Python", "Custom css"],
      liveUrl: "https://net-ninja.streamlit.app/",
      githubUrl: "https://github.com/AdityaRoy999/NetNinja",
      featured: true,
    },
    {
      title: "Emergency Ward System",
      description:
        "A fullstack web application that efficiently manages critical patient data, doctor assignments, accessories , instruments and real-time updates for emergency care. It streamlines hospital workflow, ensuring quick and accurate treatment during medical emergencies.",
      image: "/pr3.png?height=300&width=500",
      tech: ["In progress"],
      liveUrl: "",
      githubUrl: "",
      featured: true,
    },
    {
      title: "Advanced Calculator",
      description: "A terminal based tool which does basic arithmetic operations to advanced mathematical calculations, this calculator has got you covered!",
      image: "/pr3.png?height=300&width=500",
      tech: ["python"],
      githubUrl: "https://github.com/AdityaRoy999/Advance-Calculator-in-python",
      featured: false,
    },
    {
      title: "Portfolio Website",
      description: "Modern, responsive portfolio website with awesome animations, dark mode, and interactive elements.",
      image: "/placeholder.svg?height=300&width=500",
      tech: ["Next.js", "Three.js", "Typescript", "Tailwind CSS","javascript","Formspree"],
      liveUrl: "https://adityaroy-4gbe.onrender.com/",
      githubUrl: "https://github.com/AdityaRoy999/Personal-portfolio",
      featured: false,
    },
  ]

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      {project.liveUrl && project.githubUrl ? (
                        // Show normal buttons if URLs are available
                        <>
                          <Button size="sm" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        </>
                      ) : (
                        // In Progress button with solid but faded appearance
                        <Button size="sm" variant="default" className="opacity-80 hover:opacity-100">
                          In Progress
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      {project.featured && <Badge variant="secondary">Featured</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Other Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-semibold mb-8 text-center">Other Projects</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {projects
              .filter((project) => !project.featured)
              .map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        {project.liveUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
