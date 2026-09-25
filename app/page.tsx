'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const ThreePortfolio = dynamic(() => import('./three-portfolio'), { ssr: false })
const INTRO_START_TIME = 1

export default function Home() {
  const introRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressTrackRef = useRef<HTMLSpanElement>(null)
  const progressLabelRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const seekToTarget = useCallback(() => {
    const video = videoRef.current
    if (!video || video.seeking || !Number.isFinite(video.duration)) return
    if (Math.abs(video.currentTime - targetTimeRef.current) >= 1 / 48) {
      video.currentTime = targetTimeRef.current
    }
  }, [])

  const syncVideo = useCallback(() => {
    frameRef.current = null
    const intro = introRef.current
    const video = videoRef.current
    if (!intro) return

    const scrollRange = Math.max(intro.offsetHeight - window.innerHeight, 1)
    const nextProgress = Math.min(1, Math.max(0, (window.scrollY - intro.offsetTop) / scrollRange))
    if (progressTrackRef.current) progressTrackRef.current.style.transform = `scaleX(${nextProgress})`
    if (progressLabelRef.current) progressLabelRef.current.textContent = String(Math.round(nextProgress * 100)).padStart(2, '0')
    if (!video || !Number.isFinite(video.duration)) return
    targetTimeRef.current = INTRO_START_TIME + nextProgress * Math.max(video.duration - INTRO_START_TIME - 0.04, 0)

    if (!reducedMotion) seekToTarget()
  }, [reducedMotion, seekToTarget])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(motionQuery.matches)
    updatePreference()
    motionQuery.addEventListener('change', updatePreference)
    return () => motionQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const requestSync = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(syncVideo)
    }

    requestSync()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)
    return () => {
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [syncVideo])

  return (
    <main>
      <a className="skip-link" href="#portfolio">Skip introduction</a>
      <nav className="site-nav" aria-label="Introduction navigation">
        <a className="wordmark" href="#top" aria-label="Harshal Patil, home">HP<span>/26</span></a>
        <div className="nav-links"><a href="#portfolio">Enter 3D portfolio</a></div>
        <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
      </nav>

      <section id="top" ref={introRef} className={`intro-sequence ${reducedMotion || videoFailed ? 'reduce-motion' : ''}`} aria-label="Introduction">
        <div className="intro-sticky">
          {!reducedMotion && !videoFailed && <video
            ref={videoRef}
            className={`intro-video ${videoReady ? 'is-ready' : ''}`}
            muted
            playsInline
            preload="auto"
            poster="/media/intro-poster.jpg"
            aria-hidden="true"
            onLoadedMetadata={syncVideo}
            onSeeked={() => { setVideoReady(true); seekToTarget() }}
            onError={() => setVideoFailed(true)}
          >
            <source src="/media/intro-video.mp4?v=scroll-optimized" type="video/mp4" />
          </video>}

          <div className="video-shade" aria-hidden="true" />
          <div className="film-grain" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow"><span /> Full-stack / AI / real-world products</p>
            <h1>Harshal<strong>Patil.</strong></h1>
            <p className="hero-role">Full Stack Developer · AI &amp; Web Applications</p>
            <p className="hero-summary">I turn ambitious ideas into intelligent products people can actually use.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#portfolio">Enter 3D portfolio</a>
              <a className="text-action" href="/resume.pdf" target="_blank" rel="noreferrer">View resume <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="scroll-status" aria-hidden="true">
            <span className="scroll-label">Scroll to enter</span>
            <span className="scroll-track"><span ref={progressTrackRef} style={{ transform: 'scaleX(0)' }} /></span>
            <span ref={progressLabelRef} className="scroll-percent">00</span>
          </div>
        </div>
      </section>

      <ThreePortfolio />
    </main>
  )
}
