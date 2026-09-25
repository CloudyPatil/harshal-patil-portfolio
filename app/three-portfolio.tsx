'use client'

import { useRef, useState, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, useScroll, Stars, Grid, Html } from '@react-three/drei'
import * as THREE from 'three'
import Typewriter from 'typewriter-effect'
import { Github, Linkedin, ExternalLink, Trophy, BookOpen, Activity, FileDown, Cloud, type LucideIcon } from 'lucide-react'
import ContactForm from './ContactForm'
import GlitchText from './GlitchText'
import CursorComet from './CursorComet'

// Drei's Scroll html creates a React root during render. React 19 can render
// that component more than once in development, so own the root in an effect.
function ScrollHtmlSafe({ children }: { children: React.ReactNode }) {
  const scroll = useScroll()
  const height = useThree((state) => state.size.height)
  const rootRef = useRef<Root | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = createRoot(scroll.fixed)
    rootRef.current = root
    return () => {
      root.unmount()
      rootRef.current = null
      contentRef.current = null
    }
  }, [scroll.fixed])

  useEffect(() => {
    rootRef.current?.render(
      <div ref={contentRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        {children}
      </div>,
    )
  }, [children])

  useFrame(() => {
    if (contentRef.current && scroll.delta > scroll.eps) {
      contentRef.current.style.transform = `translate3d(0, ${-height * (scroll.pages - 1) * scroll.offset}px, 0)`
    }
  })

  return null
}



// --- 1. THE CAMERA RIG (Movement Logic) ---
function CameraRig() {
  const scroll = useScroll()
  useFrame((state) => {
    // Travel through the original scene and the new resume-based sections.
    const zPosition = -(scroll.offset * 180)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, zPosition, 0.1)
    state.camera.position.x = Math.sin(scroll.offset * 10) * 2
    state.camera.rotation.z = Math.sin(scroll.offset * 10) * 0.1
  })
  return null
}

// --- HELPER: ROTATING SPHERE ---
function RotatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2
    meshRef.current.rotation.x += delta * 0.1
  })

  return (
    <mesh ref={meshRef} position={[5, 0, -30]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial color="#0aff00" wireframe opacity={0.3} transparent />
    </mesh>
  )
}

// --- COMPONENT: HOLO CARD ---
const HoloCard = ({ title, items, color, borderColor }: { title: string; items: string[]; color: string; borderColor: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-black/80 border ${borderColor} p-6 rounded-lg backdrop-blur-md overflow-hidden group cursor-crosshair transition-all duration-100 ease-linear holo-card shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
    >
      <div className="absolute left-0 top-[-100%] w-full h-[50%] bg-gradient-to-b from-transparent via-white/10 to-transparent animate-[scan_3s_linear_infinite] pointer-events-none z-10"></div>
      <h3 className={`font-mono text-xl mb-4 flex items-center gap-2 font-bold`} style={{ color: color }}>
        [{title}] <div className="h-[1px] flex-grow opacity-50" style={{ backgroundColor: color }}></div>
      </h3>
      <ul className="space-y-2 font-mono text-gray-400 text-sm relative z-20">
        {items.map((item: string, i: number) => (
          <li key={i} className="group-hover:text-white transition-colors duration-200 flex items-center gap-2">
            <span style={{ color: color }}>{'>'}</span> {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 w-full bg-gray-900 h-1 relative overflow-hidden">
        <div className="h-full absolute left-0 top-0 transition-all duration-1000 group-hover:w-[100%] w-[50%]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
    </div>
  )
}

const ProjectCard = ({ title, codeName, description, tags, color, position, github, demo, metric }: { title: string; codeName: string; description: string; tags: string[]; color: string; position: 'left' | 'right'; github?: string; demo?: string; metric: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // 👇 THIS IS YOUR ORIGINAL CLASS STRING (Preserved size and position)
      className={`project-holo-card relative bg-black/90 border border-gray-800 p-6 rounded-xl backdrop-blur-xl hover:border-opacity-100 transition-all duration-300 group w-full max-w-2xl pointer-events-auto ${position === 'left' ? 'mr-auto' : position === 'right' ? 'ml-auto' : 'mx-auto'}`}
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <span className="font-mono text-xs text-gray-500">{codeName}</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>

      {/* The original card frame now holds project-specific graphic art. */}
      <div className="project-holo-art relative w-full h-48 mb-6 overflow-hidden rounded border border-gray-800 group-hover:border-white/50 transition-colors" style={{ '--project-color': color } as React.CSSProperties} aria-hidden="true">
        <span className="project-holo-ring" />
        <strong>{title.charAt(0)}</strong>
        <small>HP // {codeName}</small>
      </div>

      <h3 className="text-3xl font-bold text-white mb-2 font-cyber tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, white, ${color})` }}>{title}</h3>
      <p className="text-gray-400 font-mono text-sm mb-6 leading-relaxed">{description}</p>
      <p className="font-mono text-xs mb-5" style={{ color }}>↗ {metric}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 text-xs font-mono rounded bg-gray-900 border border-gray-700 text-gray-300 group-hover:border-white transition-colors">{tag}</span>
        ))}
      </div>

      {/* Buttons Section (Added z-index to work) */}
      <div className="flex gap-4 z-10 relative">
        {github && <a href={github} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 font-cyber text-sm hover:border-white hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider cursor-pointer">
                <Github size={16} /> CODE
            </button>
        </a>}
        {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black font-bold font-cyber text-sm hover:opacity-80 transition-all uppercase tracking-wider cursor-pointer" style={{ backgroundColor: color }}>
                    <ExternalLink size={16} /> DEMO
                </button>
            </a>
        )}
      </div>
    </div>
  )
}

// --- COMPONENT: ACHIEVEMENT CARD ---
const AchievementCard = ({ title, value, subtext, icon: Icon, color }: { title: string; value: string; subtext: string; icon: LucideIcon; color: string }) => {
  return (
    <div className="relative group bg-black/80 border border-gray-800 p-6 rounded-xl hover:border-white transition-all duration-300 w-full backdrop-blur-sm">
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-opacity">
        <Icon size={40} color={color} />
      </div>
      <div className="flex items-center gap-3 mb-2">
         <Icon size={20} color={color} />
         <span className="font-mono text-xs text-gray-500 tracking-widest">{title}</span>
      </div>
      <h3 className="text-2xl font-bold text-white font-cyber mb-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
      <p className="text-sm text-gray-400 font-mono">{subtext}</p>
      <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full rounded-b-xl overflow-hidden">
        <div className="h-full w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  )
}


// --- COMPONENT: HUD NAVIGATION (FINAL FIXED VERSION) ---
function HudNav({ visible, portalRef }: { visible: boolean; portalRef: React.RefObject<HTMLElement> }) {
  const scroll = useScroll()
  const [activeIndex, setActiveIndex] = useState(0)

  useFrame(() => {
    if (!scroll.el) return
    const page = Math.round(scroll.offset * 7)
    const currentIndex = page >= 7 ? 5 : page >= 6 ? 4 : page >= 4 ? 3 : page >= 2 ? 2 : page
    if (currentIndex !== activeIndex) setActiveIndex(currentIndex)
  })

  const navItems = [
    { label: '01 // IDENTITY', page: 0 },
    { label: '02 // SKILLS', page: 1 },
    { label: '03 // PROJECTS', page: 2 },
    { label: '04 // EXPERIENCE', page: 4 },
    { label: '05 // LOGS', page: 6 },
    { label: '06 // UPLINK', page: 7 },
  ]

  const handleScroll = (pageIndex: number) => {
    if (!scroll.el) return
    const target = pageIndex * scroll.el.clientHeight
    scroll.el.scrollTo({ top: target, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <Html
      portal={portalRef}
      // ⬇️ THIS IS THE FIX: Prevents 3D math from moving the div
      calculatePosition={() => [0, 0, 0]}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <div className="hud-nav absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end z-[99999] pointer-events-auto h-[50vh] min-h-[400px] justify-between">

        {/* THE RAIL LINE */}
        <div className="absolute right-[9px] top-0 bottom-0 w-[2px] bg-gray-900/80 border-l border-r border-gray-800 -z-10"></div>
        <div
            className="absolute right-[9px] w-[2px] bg-neon-cyan transition-all duration-700 ease-out -z-10 shadow-[0_0_15px_#00f3ff]"
            style={{ height: `${(activeIndex / (navItems.length - 1)) * 100}%`, top: 0 }}
        ></div>

                {/* THE STATIONS */}
        {navItems.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div key={index} className="group flex items-center gap-6 cursor-pointer relative" onClick={() => handleScroll(item.page)}>

              {/* UPDATED TEXT LABEL */}
              <span className={`
                hud-label font-cyber text-xs tracking-widest transition-all duration-300 font-bold whitespace-nowrap px-2 py-1 rounded
                ${isActive
                  ? 'text-neon-cyan opacity-100 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)] scale-110'
                  : 'text-gray-300 opacity-70 group-hover:opacity-100 group-hover:text-white bg-black/40 backdrop-blur-sm'}
              `}>
                {item.label}
              </span>

              {/* Station Node */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border border-neon-cyan transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                <div className={`w-4 h-4 rotate-45 border-2 transition-all duration-300 shadow-lg relative z-10 ${isActive ? 'bg-neon-cyan border-white shadow-[0_0_15px_#00f3ff]' : 'bg-black border-gray-400 group-hover:border-neon-cyan group-hover:bg-gray-900'}`}></div>
              </div>

            </div>
          )
        })}
      </div>
    </Html>
  )
}


// --- 2. THE CONTENT (3D Objects + HTML Overlay) ---
function SceneContent({ visible, portalRef }: { visible: boolean; portalRef: React.RefObject<HTMLElement> }) {
  return (
    <>



      {/* === 3D BACKGROUND === */}
      <Grid position={[0, -2, -50]} args={[100, 400]} cellColor="#00f3ff" sectionColor="#ff003c" fadeDistance={100} />
      <Stars radius={200} depth={100} count={10000} factor={4} saturation={0} fade speed={2} />

      {/* Floating Shapes */}
      <mesh position={[4, 0, -10]} rotation={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#00f3ff" wireframe />
      </mesh>

      <mesh position={[-6, 4, -20]} rotation={[1, 1, 0]}>
        <icosahedronGeometry args={[1]} />
        <meshStandardMaterial color="#ff003c" wireframe />
      </mesh>

      {/* --- STOP 2 OBJECTS (Skills Section) --- */}
      <RotatingSphere />
      <mesh position={[5, 0, -30]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#0aff00" wireframe opacity={0.3} transparent />
      </mesh>
      <mesh position={[-5, 2, -35]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#00f3ff" wireframe /></mesh>

      {/* --- STOP 3 OBJECTS (Projects) --- */}
      <mesh position={[-8, 2, -60]} rotation={[0, 0.5, 0]}><cylinderGeometry args={[0.5, 0.5, 4, 6]} /><meshStandardMaterial color="#ff003c" wireframe emissive="#ff003c" emissiveIntensity={2} /></mesh>
      <mesh position={[8, -2, -70]} rotation={[1, 0, 1]}><octahedronGeometry args={[2]} /><meshStandardMaterial color="#00f3ff" wireframe emissive="#00f3ff" emissiveIntensity={2} /></mesh>
      <mesh position={[0, 4, -80]}><torusGeometry args={[2, 0.2, 16, 100]} /><meshStandardMaterial color="#0aff00" wireframe emissive="#0aff00" emissiveIntensity={2} /></mesh>

      {/* --- STOP 4 & 5 OBJECTS (Finale) --- */}
      <mesh position={[0, 0, -100]} rotation={[0, 0, 0.7]}><ringGeometry args={[10, 11, 4]} /><meshStandardMaterial color="#ff003c" wireframe emissive="#ff003c" emissiveIntensity={1} /></mesh>
      <mesh position={[0, 0, -140]}><torusGeometry args={[8, 1, 16, 100]} /><meshStandardMaterial color="#00f3ff" wireframe emissive="#00f3ff" emissiveIntensity={2} /></mesh>
      <pointLight position={[0, 0, -145]} intensity={10} color="#00f3ff" distance={30} />

      {/* === HTML OVERLAY === */}
      <ScrollHtmlSafe>

        {/* STOP 1: HERO */}
        <div className="w-full h-screen flex flex-col items-start justify-center pl-8 md:pl-32 pointer-events-none">
            <div className="flex items-center gap-3 mb-6 bg-black/40 p-3 border border-gray-800 rounded backdrop-blur-md">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span></span>
              <span className="text-xs text-neon-green font-mono tracking-[0.2em]">SYSTEM ONLINE</span>
            </div>
              <h1 className="text-6xl md:text-9xl font-bold text-white mb-4 tracking-tighter font-cyber drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                  I&apos;m <GlitchText text="Harshal" className="text-neon-cyan font-cyber" />
              </h1>
            <div className="text-2xl md:text-4xl text-neon-pink font-mono mb-8 h-12 flex items-center">
              <span className="mr-2 text-gray-500">{'>'}</span>
              <Typewriter options={{ strings: ['FULL STACK DEVELOPER', 'AI APPLICATION BUILDER', 'WEB & MOBILE DEVELOPER', 'PRODUCTION SYSTEMS ENGINEER'], autoStart: true, loop: true, delay: 50, deleteSpeed: 30, cursorClassName: "text-neon-cyan animate-pulse" }} />
            </div>
            <div className="max-w-xl bg-black/60 p-6 border-l-4 border-neon-cyan backdrop-blur-sm">
              <p className="text-gray-300 font-mono text-sm md:text-base leading-relaxed">
                Building intelligent products people can actually use, across web, mobile, and applied AI.
                <br/><br/>
                <span className="text-gray-500">{'// CURRENT_STATUS:'}</span> B.Tech CSE, 2023–2027
                <br/>
                <span className="text-gray-500">{'// BASE_COORDS:'}</span> Navi Mumbai, IN
              </p>
            </div>
                        <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
                {/* 1. GITHUB */}
                <a href="https://github.com/CloudyPatil" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-6 py-3 border border-neon-cyan text-neon-cyan font-cyber text-sm hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                    <Github size={18} /> GITHUB
                  </button>
                </a>

                {/* 2. LINKEDIN */}
                <a href="https://www.linkedin.com/in/harshal-patil-77538a355/" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-6 py-3 border border-white text-white font-cyber text-sm hover:bg-white hover:text-black transition-all duration-300">
                    <Linkedin size={18} /> LINKEDIN
                  </button>
                </a>

                {/* 3. RESUME (Fixed: Neon Green) */}
                <a href="/resume.pdf" download="Harshal_Resume.pdf">
                  <button className="flex items-center gap-2 px-6 py-3 border border-neon-green text-neon-green font-cyber text-sm hover:bg-neon-green hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(10,255,0,0.2)]">
                    <FileDown size={18} /> RESUME
                  </button>
                </a>

            </div>
        </div>

        {/* STOP 2: SKILLS */}
        <div className="scene-skills absolute top-[100vh] w-full h-screen flex flex-col items-end justify-center pr-8 md:pr-20 pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 font-cyber text-right drop-shadow-[0_0_10px_#ff003c]">
              SYSTEM <span className="text-neon-pink font-cyber"><GlitchText text="CAPABILITIES" /></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full pointer-events-auto">
                <HoloCard title="WEB_MATRIX" color="#00f3ff" borderColor="border-neon-cyan/50" items={['React / Next.js / React Native', 'Node.js / Express / FastAPI', 'PostgreSQL / MongoDB / MySQL', 'TypeScript / Tailwind CSS']} />
                <HoloCard title="NEURAL_NETS" color="#ff003c" borderColor="border-neon-pink/50" items={['Python / LightGBM', 'SBERT / SHAP', 'Whisper / MediaPipe', 'Groq / Llama']} />
                <HoloCard title="CORE_OPS" color="#0aff00" borderColor="border-neon-green/50" items={['REST APIs / WebSockets', 'Git / GitHub', 'System design / RBAC', 'Cloud deployment']} />
            </div>
        </div>

                {/* STOP 3: PROJECTS */}
        <div className="absolute top-[200vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard
                title="RECRUITAI"
                codeName="PROJECT_ID: INTELLIGENT_HIRING"
                description="Semantic resume matching, explainable candidate scores, a three-round adaptive AI interviewer, and live anti-cheat monitoring in one hiring workflow."
                tags={['React', 'FastAPI', 'SBERT', 'SHAP', 'Whisper', 'MediaPipe']}
                color="#ff003c"
                position="left"
                github="https://github.com/CloudyPatil/Recruit-AI"
                demo="https://drive.google.com/file/d/17bFmaPSR4AYL-qjue2GbY9WMaq29iV_r/view?usp=sharing"
                metric="80% reduction in HR screening time"
            />
        </div>
        <div className="absolute top-[260vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard
                title="TRADEDO"
                codeName="PROJECT_ID: MARKET_INTELLIGENCE"
                description="A solo-built stock analysis system with a 200-point scoring engine, twelve safety gates, LightGBM forecasts, and adaptive Q-learning."
                tags={['Next.js', 'FastAPI', 'Python', 'LightGBM', 'Upstox']}
                color="#00f3ff"
                position="right"
                metric="150+ NSE stocks · 1.2M+ training data points"
            />
        </div>
        <div className="absolute top-[320vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard
                title="PRESENTE"
                codeName="PROJECT_ID: ATTENDANCE_SAAS"
                description="A production mobile app with expiring class QR sessions, four user roles, automated absence marking, and course analytics."
                tags={['React Native', 'Expo', 'Node.js', 'PostgreSQL', 'Prisma']}
                color="#0aff00"
                position="left"
                metric="4-role access · expiring QR sessions"
            />
        </div>

        {/* STOP 4 & 5: EXPERIENCE */}
        <ExperienceStop group={0} top="400vh" />
        <ExperienceStop group={1} top="500vh" />

        {/* STOP 6: OPERATOR LOGS */}
        <div className="absolute top-[600vh] w-full h-screen flex flex-col justify-center px-8 md:px-32 pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 font-cyber text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              OPERATOR <span className="text-yellow-500">LOGS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pointer-events-auto">
                <AchievementCard title="ACADEMIC_PERFORMANCE" value="8.30 CGPA" subtext="B.Tech CSE · through Semester VI" icon={BookOpen} color="#0aff00" />
                <AchievementCard title="COMPETITIVE_EVENTS" value="SIH 2025 Qualified" subtext="Internal college round · Nirman National Hackathon" icon={Trophy} color="#fbbf24" />
                <AchievementCard title="PHYSICAL_DIVISION" value="MU Football 2024" subtext="Represented Pillai College Team" icon={Activity} color="#ff003c" />
                <AchievementCard title="CLOUD_LEARNING" value="22 BADGES" subtext="Google Cloud Skills Boost" icon={Cloud} color="#00f3ff" />
            </div>
        </div>

        {/* STOP 7: UPLINK */}
        <div className="absolute top-[700vh] w-full h-screen flex flex-col items-center justify-center text-center pointer-events-none pb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-cyber animate-pulse">
              ESTABLISH <span className="text-neon-cyan font-cyber"><GlitchText text="UPLINK" /></span>
            </h2>

            {/* THIS COMPONENT REPLACES THE OLD HTML FORM */}
            <ContactForm />
            <div className="mt-5 flex flex-wrap justify-center gap-5 pointer-events-auto font-mono text-xs text-neon-cyan">
              <a href="mailto:harshalgenai@gmail.com">harshalgenai@gmail.com</a>
              <a href="tel:+917208317436">+91 72083 17436</a>
            </div>

             {/* NEW: FOOTER DOWNLOAD BUTTON (Big & Visible) */}
            <div className="mt-8 w-full max-w-md pointer-events-auto">
               <a
                 href="/resume.pdf"
                 download="Harshal_Resume.pdf"
                 className="flex items-center justify-center gap-3 w-full py-4 border border-gray-600 bg-gray-900/50 hover:bg-neon-green hover:border-neon-green hover:text-black hover:scale-[1.02] text-gray-300 transition-all duration-300 rounded font-cyber tracking-widest text-sm group"
               >
                  <FileDown size={20} className="group-hover:animate-bounce" />
                  [ DOWNLOAD_FULL_DOSSIER.PDF ]
               </a>
            </div>

            {/* FIXED: Copyright Text (Brighter Color) */}
            <div className="mt-12 font-mono text-xs text-gray-400 select-none">
                <p>SYSTEM ARCHITECT: HARSHAL PATIL</p>
                <p className="mt-2 opacity-60">© 2026 ALL RIGHTS RESERVED {'// END_OF_LINE'}</p>
            </div>
        </div>



      </ScrollHtmlSafe>

      {/* === HUD NAVIGATION (New Addition) === */}
      <HudNav visible={visible} portalRef={portalRef} />

    </>
  )
}

// --- 3. THE MAIN PAGE ---
export default function ThreePortfolio() {
  const sectionRef = useRef<HTMLElement>(null!)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.45 })
    observer.observe(section)
    if (window.location.hash === '#portfolio') section.scrollIntoView({ block: 'start' })
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="portfolio" className="three-portfolio h-screen w-full bg-void-black">
      <div className="scene-cursor"><CursorComet /></div>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} frameloop={visible ? 'always' : 'demand'}>

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <fog attach="fog" args={['#050505', 5, 60]} />

        <ScrollControls pages={8} damping={0.2}>
          <CameraRig />
          <SceneContent visible={visible} portalRef={sectionRef} />
        </ScrollControls>

      </Canvas>
    </section>
  )
}

const experience = [
  { dates: 'AUG 2026 — PRESENT', title: 'AI Full Stack Developer Intern', company: 'TransformNXT', details: 'Built real-time AI proctoring for interviews and assessments. Client-side vision and audio analysis supports 30 FPS fraud detection, evidence logging, and live alerts.', stack: 'React · TypeScript · FastAPI · WebSockets · MongoDB' },
  { dates: 'JUN — JUL 2026', title: 'Full Stack Developer Intern', company: 'Vform Tecnopacks Pvt. Ltd.', details: 'Delivered a production asset management system with Admin, Manager, and Staff roles, assignment and maintenance workflows, and analytics.', stack: 'React · Node.js · Express · MySQL', href: 'https://vform-asset-manager.vercel.app/', linkLabel: 'LIVE SYSTEM' },
  { dates: 'MAY 2024 — PRESENT', title: 'Freelance Full Stack Developer', company: 'Independent', details: 'Shipped three client projects: an Android voting app and two production clinic websites with WhatsApp and Google Maps integrations.', stack: 'Android · Java · Web development', href: 'https://dr-ravi-ahuja-dental.vercel.app/', linkLabel: 'CLINIC SITE' },
  { dates: 'AUG 2025 — JAN 2026', title: 'Python & AI/ML Intern', company: 'Sure Trust', details: 'Completed a six-month program in Python, data handling, and machine learning, including a two-month capstone implementation.', stack: 'Python · Data · Machine learning' },
]

function ExperienceStop({ group, top }: { group: number; top: string }) {
  return <div className="absolute w-full h-screen flex flex-col justify-center px-8 md:px-32 pointer-events-none" style={{ top }}>
    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-cyber drop-shadow-[0_0_10px_#00f3ff]">FIELD <span className="text-neon-cyan">EXPERIENCE</span></h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl pointer-events-auto">
      {experience.slice(group * 2, group * 2 + 2).map(role => <article className="experience-holo-card bg-black/85 border border-neon-cyan/40 rounded-xl p-5 md:p-7 backdrop-blur-xl" key={role.company}>
        <span className="text-neon-cyan font-mono text-xs tracking-widest">{role.dates}</span>
        <h3 className="font-cyber text-lg md:text-2xl mt-4 mb-2">{role.title}</h3>
        <strong className="text-neon-pink font-mono text-sm">{role.company}</strong>
        <p className="text-gray-300 font-mono text-xs md:text-sm leading-relaxed my-4">{role.details}</p>
        <small className="text-gray-500 font-mono">{role.stack}</small>
        {role.href && <a href={role.href} target="_blank" rel="noreferrer" className="block mt-4 text-neon-cyan font-cyber text-xs">{role.linkLabel} ↗</a>}
      </article>)}
    </div>
  </div>
}
