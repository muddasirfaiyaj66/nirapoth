"use client"

import { useEffect, useRef } from "react"

export function BangladeshiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Flowing river particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 0.5 + 0.2
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(57, 138, 88, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background inspired by Bangladesh landscapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1a0f] to-[#1A3335]" />

      {/* Traditional Nakshi Kantha pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="nakshi-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Diamond pattern inspired by traditional embroidery */}
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#398A58" strokeWidth="1" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="#398A58" strokeWidth="1" />
            <path d="M50 20 L70 50 L50 80 L30 50 Z" fill="none" stroke="#398A58" strokeWidth="0.5" />
            {/* Corner decorations */}
            <circle cx="0" cy="0" r="3" fill="#398A58" />
            <circle cx="100" cy="0" r="3" fill="#398A58" />
            <circle cx="0" cy="100" r="3" fill="#398A58" />
            <circle cx="100" cy="100" r="3" fill="#398A58" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nakshi-pattern)" />
      </svg>

      {/* Flowing river particles (canvas) */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Animated green field waves */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-10">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z"
            fill="#398A58"
            className="animate-wave"
          />
        </svg>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,70 C200,20 400,100 600,70 C800,40 1000,90 1200,70 L1200,120 L0,120 Z"
            fill="#1A3335"
            className="animate-wave-slow"
          />
        </svg>
      </div>

      {/* Subtle grid overlay for modern tech feel */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#398A58 1px, transparent 1px),
            linear-gradient(90deg, #398A58 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
