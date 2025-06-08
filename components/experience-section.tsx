"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience")

  const workExperience = [
    {
      title: "Cybersecurity Intern",
      company: "NullClass EdTech Private Limited",
      location: "Mumbai, India",
      period: "May 2025 - June 2025",
      description: "Learned and upgraded my skills in SOC Analysis, came to know about SOC in detail, their role and responsibilities. Performed hands-on training lab exercises.",
      skills: ["Python", "SOC Analysis", "Intrusion Detection", "IDPS", "IPS", "SIEM"],
      type: "internship"
    },
    {
      title: "Core Team Member Cisco Club",
      company: "Cisco Technical Club",
      location: "VIT Bhopal University, Bhopal",
      period: "Nov 2024 - Ongoing",
      description: "Responsible for researching about Cisco Technologies that make impact in real world. Making sure of tasks and formalities during Cisco events.",
      skills: ["Effective Communication", "Team Work", "Researching"],
      type: "club"
    },
    {
      title: "Core Team Member Microsoft Technical Club",
      company: "Microsoft Technical Club",
      location: "VIT Bhopal University, Bhopal",
      period: "Nov 2024 - Ongoing",
      description: "Responsible for researching about Microsoft Technologies that make impact in real world. Making sure of tasks and formalities during Microsoft club events.",
      skills: ["Effective Communication", "Team Work", "Researching"],
      type: "club"
    }
  ]

  const education = [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "VIT Bhopal University",
      location: "Bhopal, India",
      period: "2023 - 2027",
      description: "Focused on cybersecurity, web development, and data structures. Participated in hackathons and coding competitions.",
      achievements: ["InnovMinds Expo Winner 2025", "Spacevita hackathon Deep-Space CodeJam 2nd place", "Several Certifications from Microsoft, Google and LinkedIn"]
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Shree LR Tiwari College of Engineering",
      location: "Mumbai, India",
      period: "2021 - 2023",
      description: "Science stream with Mathematics, Physics, and Chemistry.",
      achievements: []
    },
    {
      degree: "Indian Certificate of Secondary Education (ICSE)",
      institution: "RBK School",
      location: "Mumbai, India",
      period: "2012 - 2021",
      description: "Secondary Education subjects like Maths, Physics, History, Geography, Biology.",
      achievements: []
    }
  ]

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience & Education</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            My professional journey and academic background
          </p>
          
          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <Button 
              size="lg"
              variant={activeTab === "experience" ? "default" : "outline"}
              onClick={() => setActiveTab("experience")}
              className="flex items-center gap-2 min-w-[160px]"
            >
              <Briefcase className="h-5 w-5" />
              Experience
            </Button>
            <Button 
              size="lg"
              variant={activeTab === "education" ? "default" : "outline"}
              onClick={() => setActiveTab("education")}
              className="flex items-center gap-2 min-w-[160px]"
            >
              <GraduationCap className="h-5 w-5" />
              Education
            </Button>
          </div>
        </motion.div>

        {/* Timeline Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === "experience" ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block"></div>
              
              <div className="space-y-12">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold flex items-center">
                    <Briefcase className="mr-2 h-6 w-6 text-primary" />
                    Work Experience
                  </h3>
                </div>
                
                {workExperience.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }} // Changed
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 top-8 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg hidden md:block z-10"></div>
                    
                    {/* Content Card */}
                    <div className="md:ml-20 ml-0">
                      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <Badge variant="outline" className="flex items-center bg-primary/10">
                              <Calendar className="h-3 w-3 mr-1" />
                              {job.period}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            {job.type === "club" ? (
                              <Users className="h-4 w-4 mr-2" />
                            ) : (
                              <Briefcase className="h-4 w-4 mr-2" />
                            )}
                            <span className="font-medium">{job.company}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-muted-foreground leading-relaxed">{job.description}</p>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Technologies & Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block"></div>
              
              <div className="space-y-12">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold flex items-center">
                    <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                    Education
                  </h3>
                </div>
                
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }} // ✅ Changed from once: true to once: false
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 top-8 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg hidden md:block z-10"></div>
                    
                    {/* Content Card */}
                    <div className="md:ml-20 ml-0">
                      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary hover:scale-[1.02]">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <CardTitle className="text-xl">{edu.degree}</CardTitle>
                            <Badge variant="outline" className="flex items-center bg-primary/10">
                              <Calendar className="h-3 w-3 mr-1" />
                              {edu.period}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            <span className="font-medium">{edu.institution}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{edu.location}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-muted-foreground leading-relaxed">{edu.description}</p>
                          {edu.achievements && edu.achievements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Achievements & Honors:</h4>
                              <div className="space-y-2">
                                {edu.achievements.map((achievement, idx) => (
                                  <div key={idx} className="flex items-start">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-muted-foreground">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}