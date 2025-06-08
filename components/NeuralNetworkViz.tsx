"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import {
  OrbitControls,
  Float,
  Text,
  Html,
  useTexture,
  Environment,
  Billboard,
} from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

// Types
interface Skill {
  name: string
  logo: string
}

interface TechOrbProps {
  skill: Skill;
  position: [number, number, number];
  category: string;
  onClick: (skill: Skill, category: string, position: [number, number, number]) => void;
  isActive: boolean;
}

interface ActiveSkillInfo {
  skill: Skill;
  category: string;
  position: [number, number, number];
}

interface TechOrbsSceneProps {
  techStack: {
    [category: string]: Skill[]
  }
}

interface TechOrbsProps {
  className?: string
  techStack: {
    [category: string]: Skill[]
  }
}

// Category colors
const categoryColors: Record<string, string> = {
  Frontend: '#4287f5', // Blue
  Backend: '#42f59e',  // Green
  DevTools: '#f5a742', // Orange
  'AI/ML': '#e242f5',  // Purple
}

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// A single tech orb
const TechOrb = ({ skill, position, category, onClick, isActive }: TechOrbProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()
  
  // Handle texture loading safely
  const texture = useTexture(skill.logo)

  // Add error handling for the texture
  useEffect(() => {
    const handleError = () => {
      console.warn(`Failed to load texture for ${skill.name}`)
    }
    
    // Add error event listener to the texture's source
    if (texture && texture.source) {
      texture.source.data?.addEventListener?.('error', handleError)
    }
    
    return () => {
      if (texture && texture.source) {
        texture.source.data?.removeEventListener?.('error', handleError)
      }
    }
  }, [texture, skill.name])
  
  // Simple animation
  const { scale } = useSpring({
    scale: hovered ? 1.2 : isActive ? 1.1 : 1,
    config: { tension: 280, friction: 20 }
  })
  
  // Gentle rotation
  useFrame(() => {
    if (meshRef.current && !isActive) {
      meshRef.current.rotation.y += 0.01
    }
  })
  
  const color = categoryColors[category] || '#ffffff'
  
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <animated.mesh
          ref={meshRef}
          scale={scale}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onClick(skill, category, position)
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            if (!isMobile) { // Only on desktop
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            if (!isMobile) { // Only on desktop
              setHovered(false)
              document.body.style.cursor = 'auto'
            }
          }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            map={texture}
            emissive={color}
            emissiveIntensity={hovered ? 0.4 : isActive ? 0.3 : 0.1}
            metalness={0.3}
            roughness={0.4}
          />
        </animated.mesh>
        
        {/* Skill name label - always follows camera */}
        <Billboard follow={true}>
          <Html position={[0, -2.2, 0]} center distanceFactor={isMobile ? 10 : 8}>
            <div className={`px-2 py-1 rounded-md text-center transition-all duration-200 ${
              hovered || isActive 
                ? 'bg-black/80 backdrop-blur-sm border border-white/20 scale-110' 
                : 'bg-black/60'
            }`}>
              <p className={`font-medium text-white whitespace-nowrap ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                {skill.name}
              </p>
            </div>
          </Html>
        </Billboard>
      </Float>
    </group>
  )
}

// Tech skill descriptions based on your actual tech stack
const techDescriptions: Record<string, string> = {
  // Frontend
  'React': 'A powerful JavaScript library for building user interfaces with component-based architecture and virtual DOM.',
  'Next.js': 'Full-stack React framework with server-side rendering, API routes, and automatic optimization features.',
  'Python': 'Versatile programming language excellent for web development, automation, data science, and AI applications.',
  'TypeScript': 'Strongly typed JavaScript superset that enhances code reliability and provides better developer experience.',
  'JavaScript': 'Dynamic programming language that powers modern web development and interactive user experiences.',
  
  // Backend
  'Node.js': 'JavaScript runtime built on Chrome\'s V8 engine for building scalable server-side applications and APIs.',
  'MySQL': 'Popular open-source relational database management system known for reliability and performance.',
  
  // DevTools
  'Git': 'Distributed version control system for tracking code changes and enabling collaborative software development.',
  'Docker': 'Containerization platform that packages applications with dependencies for consistent deployment across environments.',
  'Google Cloud': 'Comprehensive cloud computing platform offering scalable infrastructure, AI services, and data analytics.',
  'Vercel': 'Modern deployment platform optimized for frontend frameworks with instant global CDN and Git integration.',
  'Figma': 'Collaborative design tool for creating user interfaces, prototypes, and design systems with real-time collaboration.',
  
  // AI/ML
  'OpenAI API': 'Powerful AI API providing access to advanced language models like GPT for natural language processing.',
  'TensorFlow': 'Open-source machine learning framework for building and deploying ML models at scale across platforms.',
  'PyTorch': 'Dynamic deep learning framework preferred by researchers for flexible neural network development and experimentation.',
  'Jupyter': 'Interactive computing environment for data science, allowing code execution, visualization, and documentation in notebooks.'
}

// Function to get description for a skill
const getSkillDescription = (skillName: string, category: string): string => {
  return techDescriptions[skillName] || 
    `A powerful ${category.toLowerCase()} technology used for building modern applications and enhancing development workflows.`
}

// Main scene component
const TechOrbsScene = ({ techStack }: TechOrbsSceneProps) => {
  const [activeSkill, setActiveSkill] = useState<ActiveSkillInfo | null>(null)
  const sceneRef = useRef<THREE.Group>(null)
  const isMobile = useIsMobile()
  
  // Handle orb clicks
  const handleOrbClick = (skill: Skill, category: string, position: [number, number, number]) => {
    if (activeSkill && activeSkill.skill.name === skill.name) {
      setActiveSkill(null) // Deselect if same orb clicked
    } else {
      setActiveSkill({ skill, category, position })
    }
  }
  
  // Calculate orb positions - adjusted for mobile
  const orbPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {}
    const categoryPositions: Record<string, [number, number, number]> = {}
    const categories = Object.keys(techStack)
    const totalCategories = categories.length
    
    // Adjust radius based on device
    const categoryRadius = isMobile ? 6 : 8
    const skillRadius = isMobile ? 2.5 : 3
    const labelRadius = isMobile ? 9 : 12
    
    categories.forEach((category, categoryIndex) => {
      const skills = techStack[category]
      const categoryAngle = (categoryIndex / totalCategories) * Math.PI * 2
      
      // Category center position
      const centerX = Math.cos(categoryAngle) * categoryRadius
      const centerZ = Math.sin(categoryAngle) * categoryRadius
      
      // Store category position for labels
      categoryPositions[category] = [
        Math.cos(categoryAngle) * labelRadius,
        isMobile ? 2 : 3,
        Math.sin(categoryAngle) * labelRadius
      ]
      
      // Arrange skills around category center
      skills.forEach((skill, skillIndex) => {
        const skillAngle = (skillIndex / skills.length) * Math.PI * 2
        
        const x = centerX + Math.cos(skillAngle) * skillRadius
        const y = Math.sin(skillIndex) * (isMobile ? 1 : 1.5)
        const z = centerZ + Math.sin(skillAngle) * skillRadius
        
        positions[`${category}-${skill.name}`] = [x, y, z]
      })
    })
    
    return { positions, categoryPositions }
  }, [techStack, isMobile])
  
  // Define specific rotation angles for each category header
  const getCategoryRotation = (category: string, index: number) => {
    const rotationAngles: Record<string, number> = {
      'Frontend': -5,
      'Backend': Math.PI * 6,
      'DevTools': Math.PI * 6 + 4.6,
      'AI/ML': Math.PI * 1
    }
    
    return rotationAngles[category] || (index / Object.keys(techStack).length) * Math.PI * 2
  }
  
  return (
    <group ref={sceneRef}>
      {/* Lighting setup */}
      <Environment preset="studio" />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4287f5" />
      
      {/* Category labels - adjusted for mobile */}
      {Object.keys(techStack).map((category, index) => {
        const position = orbPositions.categoryPositions[category]
        if (!position) return null
        
        const rotationAngle = getCategoryRotation(category, index)
        
        return (
          <Text
            key={category}
            position={position}
            fontSize={isMobile ? 1.2 : 2}
            color={categoryColors[category] || '#ffffff'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
            rotation={[0, rotationAngle, 0]}
          >
            {category}
          </Text>
        )
      })}
      
      {/* Render all orbs */}
      {Object.entries(techStack).map(([category, skills]) =>
        skills.map((skill) => {
          const position = orbPositions.positions[`${category}-${skill.name}`]
          if (!position) return null
          
          return (
            <TechOrb
              key={`${category}-${skill.name}`}
              skill={skill}
              position={position}
              category={category}
              onClick={handleOrbClick}
              isActive={activeSkill?.skill.name === skill.name}
            />
          )
        })
      )}
      
      {/* Active skill info panel - responsive sizing */}
      {activeSkill && (
        <group position={activeSkill.position}>
          <Billboard follow={true}>
            <Html 
              position={[isMobile ? 3 : 4, 0, 0]}
              center 
              distanceFactor={isMobile ? 8 : 11}
            >
              <div className={`p-4 rounded-xl bg-black/90 backdrop-blur-md border border-white/20 shadow-2xl ${
                isMobile ? 'w-64' : 'w-80'
              }`}>
                <div className={`flex items-center gap-3 mb-3 ${isMobile ? 'gap-2 mb-2' : ''}`}>
                  <div className={`rounded-lg bg-white/10 p-2 flex items-center justify-center ${
                    isMobile ? 'w-12 h-12' : 'w-16 h-16'
                  }`}>
                    <img
                      src={activeSkill.skill.logo}
                      alt={activeSkill.skill.name}
                      className={`object-contain ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = "/api/placeholder/48/48"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-white leading-tight ${
                      isMobile ? 'text-lg mb-1' : 'text-xl mb-2'
                    }`}>
                      {activeSkill.skill.name}
                    </h3>
                    <div 
                      className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}
                      style={{ color: categoryColors[activeSkill.category] }}
                    >
                      {activeSkill.category}
                    </div>
                  </div>
                </div>
                <p className={`text-gray-300 leading-relaxed mb-3 ${
                  isMobile ? 'text-sm mb-2' : 'text-base mb-4'
                }`}>
                  {getSkillDescription(activeSkill.skill.name, activeSkill.category)}
                </p>
                <div className={`text-gray-500 text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Click the orb again to close
                </div>
              </div>
            </Html>
          </Billboard>
        </group>
      )}
    </group>
  )
}

// Main export component - Fixed loading issue
export default function TechOrbs({ techStack, className = "" }: TechOrbsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const isMobile = useIsMobile()
  
  // Fixed loading timing
  useEffect(() => {
    // Set ready immediately when component mounts
    setIsReady(true)
    
    // Then set loading to false after a shorter delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])
  
  // Don't render canvas until component is ready
  if (!isReady) {
    return (
      <div className={`relative w-full h-full min-h-[600px] ${className} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-white/70">Loading Tech Stack...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`relative w-full h-full min-h-[600px] ${className}`} style={{ touchAction: 'pan-y' }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-white/70">Loading Tech Stack...</p>
          </div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, isMobile ? 16 : 20], 
          fov: isMobile ? 70 : 60 
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
        style={{ background: '#030014' }}
      >
        <fog attach="fog" color="#030014" near={10} far={35} />
        <TechOrbsScene techStack={techStack} />
        
        {/* Controls - adjusted for mobile */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={isMobile ? 8 : 12}
          maxDistance={isMobile ? 20 : 30}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={isMobile ? 1.2 : 0.8}
          zoomSpeed={isMobile ? 0.8 : 1}
        />
      </Canvas>
      
      {/* Instructions - responsive */}
      <div className={`absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 ${
        isMobile ? 'text-xs' : 'text-xs'
      }`}>
        {isMobile ? 'Touch to rotate • Pinch to zoom • Tap orbs' : 'Drag to rotate • Scroll to zoom • Click orbs for details'}
      </div>
    </div>
  )
}