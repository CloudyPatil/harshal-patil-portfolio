'use client'
import { useEffect, useRef } from 'react'

export default function CursorComet() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e
      
      // 1. Move Inner Dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
      }
      
      // 2. Move Outer Ring Wrapper
      if (ringWrapperRef.current) {
        ringWrapperRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
      }
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  return (
    <>
      {/* 1. The Center Dot (Increased to 12px) */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ marginLeft: -6, marginTop: -6 }} // Half of 12px to center it
      />

      {/* 2. The Ring Wrapper (Handles Movement X/Y) */}
      <div 
        ref={ringWrapperRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        // Increased size: 64px (w-16). Offset is -32px (half of 64)
        style={{ marginLeft: -32, marginTop: -32 }} 
      >
        {/* 3. The Actual Ring (Handles Rotation) */}
        <div className="w-16 h-16 border border-neon-cyan/50 rounded-full relative animate-[spin_10s_linear_infinite]">
            
            {/* Decorative "Crosshair" marks */}
            <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1 h-3 bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></div>
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-1 h-3 bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></div>
            <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-3 h-1 bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></div>
            <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-3 h-1 bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></div>

        </div>
      </div>
    </>
  )
}