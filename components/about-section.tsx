"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Award, Users, Coffee } from "lucide-react"

export function AboutSection() {
  const stats = [
    { icon: Award, label: "Years Experience", value: "1+" },
    { icon: Users, label: "Projects Completed", value: "5+" },
    { icon: Coffee, label: "Cups of Coffee", value: "∞" },
  ]

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with a love for creating exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a cybersecurity student with over a year of hands-on experience in web development. I work with Python for backend development and React/Next.js on the frontend to build applications that are both functional and secure.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                My background in cybersecurity gives me a strong foundation in thinking critically about how systems work, how they can fail, and how to build with safety and reliability in mind. Whether it’s a small project or a larger application, I focus on writing clean, maintainable code and creating interfaces that are intuitive to use.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Currently seeking opportunities as a <strong>Cyber security Intern </strong> or
                <strong> Backend Developer </strong> where I can contribute to meaningful projects and continue
                growing as a developer.
              </p>

              <div className="pt-4">
                <a href="resume.pdf" download="aditya-resume.pdf">
                  <Button size="lg" className="group">
                    <Download className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    Download Resume
                  </Button>
                </a>
              </div>
              </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What I'm Looking For</h3>
                    <p className="text-sm text-muted-foreground">
                      I'm actively seeking full-time opportunities where I can contribute to innovative projects, work
                      with talented teams, and continue growing as a developer.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
