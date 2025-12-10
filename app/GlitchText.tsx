'use client'
import { useState, useRef } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  speed?: number
}

export default function GlitchText({ text, className = "", speed = 30 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Cyberpunk characters for the effect
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*"

  const animate = () => {
    let iteration = 0
    
    clearInterval(intervalRef.current as NodeJS.Timeout)

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      if (iteration >= text.length) { 
        clearInterval(intervalRef.current as NodeJS.Timeout)
      }
      
      iteration += 1 / 3
    }, speed)
  }

  return (
    <span 
      onMouseEnter={animate}
      // Added 'pointer-events-auto' so it captures the mouse
      // Removed 'font-mono' so it keeps your parent font
      className={`inline-block cursor-crosshair pointer-events-auto ${className}`}
    >
      {displayText}
    </span>
  )
}