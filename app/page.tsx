'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Stars, Grid, Scroll, Html } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import Typewriter from 'typewriter-effect'
import { Github, Linkedin, Mail, Terminal, ExternalLink, Trophy, Youtube, BookOpen, Activity, FileDown } from 'lucide-react'
import ContactForm from './ContactForm'
import GlitchText from './GlitchText'

// --- 1. THE CAMERA RIG (Movement Logic) ---
function CameraRig() {
  const scroll = useScroll()
  useFrame((state) => {
    // Moves camera from Z=0 to Z=-140 (Covers all sections)
    const zPosition = -(scroll.offset * 140)
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
const HoloCard = ({ title, items, color, borderColor }: any) => {
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

// --- COMPONENT: PROJECT CARD ---
const ProjectCard = ({ title, codeName, description, tags, color, position, image, github, demo }: any) => {
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
      className={`relative bg-black/90 border border-gray-800 p-6 rounded-xl backdrop-blur-xl hover:border-opacity-100 transition-all duration-300 group w-full max-w-2xl pointer-events-auto ${position === 'left' ? 'mr-auto' : position === 'right' ? 'ml-auto' : 'mx-auto'}`}
      style={{ borderColor: color }} 
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <span className="font-mono text-xs text-gray-500">{codeName}</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>
      <div className="relative w-full h-48 mb-6 overflow-hidden rounded border border-gray-800 group-hover:border-white/50 transition-colors">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-2 font-cyber tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, white, ${color})` }}>{title}</h3>
      <p className="text-gray-400 font-mono text-sm mb-6 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 text-xs font-mono rounded bg-gray-900 border border-gray-700 text-gray-300 group-hover:border-white transition-colors">{tag}</span>
        ))}
      </div>
      <div className="flex gap-4">
        <a href={github} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 font-cyber text-sm hover:border-white hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"><Github size={16} /> CODE</button>
        </a>
        {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black font-bold font-cyber text-sm hover:opacity-80 transition-all uppercase tracking-wider" style={{ backgroundColor: color }}><ExternalLink size={16} /> DEMO</button>
            </a>
        )}
      </div>
    </div>
  )
}

// --- COMPONENT: ACHIEVEMENT CARD ---
const AchievementCard = ({ title, value, subtext, icon: Icon, color }: any) => {
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
function HudNav() {
  const scroll = useScroll()
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useFrame(() => {
    if (!scroll.el) return
    const scrollPosition = scroll.offset
    const totalPages = 5 
    const currentIndex = Math.round(scrollPosition * (totalPages - 1))
    if (currentIndex !== activeIndex) setActiveIndex(currentIndex)
  })

  const navItems = [
    { label: '01 // IDENTITY', page: 0 },
    { label: '02 // SKILLS', page: 1 },
    { label: '03 // PROJECTS', page: 2 },
    { label: '04 // LOGS', page: 4 },
    { label: '05 // UPLINK', page: 5 },
  ]

  const handleScroll = (pageIndex: number) => {
    if (!scroll.el) return
    const target = pageIndex * scroll.el.clientHeight
    scroll.el.scrollTo({ top: target, behavior: 'smooth' })
  }

  if (!mounted) return null

  return (
    <Html 
      portal={document.body as any}
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
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end z-[99999] pointer-events-auto h-[50vh] min-h-[400px] justify-between">
        
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
                font-cyber text-xs tracking-widest transition-all duration-300 font-bold whitespace-nowrap px-2 py-1 rounded
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
function SceneContent() {
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
      <Scroll html style={{ width: '100%', height: '100%' }}>
        
        {/* STOP 1: HERO */}
        <div className="w-full h-screen flex flex-col items-start justify-center pl-8 md:pl-32 pointer-events-none">
            <div className="flex items-center gap-3 mb-6 bg-black/40 p-3 border border-gray-800 rounded backdrop-blur-md">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span></span>
              <span className="text-xs text-neon-green font-mono tracking-[0.2em]">SYSTEM ONLINE</span>
            </div>
              <h1 className="text-6xl md:text-9xl font-bold text-white mb-4 tracking-tighter font-cyber drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                  I'm <GlitchText text="Harshal" className="text-neon-cyan font-cyber" />
              </h1>
            <div className="text-2xl md:text-4xl text-neon-pink font-mono mb-8 h-12 flex items-center">
              <span className="mr-2 text-gray-500">{'>'}</span>
              <Typewriter options={{ strings: ['FULL STACK DEVELOPER', 'AI & ML ENGINEER', 'CREATIVE CODER', 'SCALABLE SYSTEMS ARCHITECT'], autoStart: true, loop: true, delay: 50, deleteSpeed: 30, cursorClassName: "text-neon-cyan animate-pulse" }} />
            </div>
            <div className="max-w-xl bg-black/60 p-6 border-l-4 border-neon-cyan backdrop-blur-sm">
              <p className="text-gray-300 font-mono text-sm md:text-base leading-relaxed">
                <span className="text-neon-cyan"></span> Architecting intelligent systems and immersive digital realities.
                <br/><br/>
                <span className="text-gray-500">// CURRENT_STATUS:</span> B.Tech CSE (Year III)
                <br/>
                <span className="text-gray-500">// BASE_COORDS:</span> Navi Mumbai, IN
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
        <div className="absolute top-[100vh] w-full h-screen flex flex-col items-end justify-center pr-8 md:pr-20 pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 font-cyber text-right drop-shadow-[0_0_10px_#ff003c]">
              SYSTEM <span className="text-neon-pink font-cyber"><GlitchText text="CAPABILITIES" /></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full pointer-events-auto">
                <HoloCard title="WEB_MATRIX" color="#00f3ff" borderColor="border-neon-cyan/50" items={['React.js / Next.js', 'Node.js / Express', 'Tailwind CSS', 'MongoDB / Postgres']} />
                <HoloCard title="NEURAL_NETS" color="#ff003c" borderColor="border-neon-pink/50" items={['Python (Core)', 'OpenCV (Vision)', 'TensorFlow / Keras', 'Pandas / NumPy']} />
                <HoloCard title="CORE_OPS" color="#0aff00" borderColor="border-neon-green/50" items={['Java (DSA)', 'Git / GitHub', 'Linux / Bash', 'VS Code / Postman']} />
            </div>
        </div>

        {/* STOP 3: PROJECTS */}
        <div className="absolute top-[200vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard title="PASHU AI" codeName="PROJECT_ID: BIO_AGRI_NET" description="A comprehensive AI diagnostic tool for livestock health. Integrates computer vision for cattle breed classification and automated disease prediction." tags={['Python', 'TensorFlow', 'React.js', 'Node.js']} color="#ff003c" position="left" image="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop" github="#" demo="#" />
        </div>
        <div className="absolute top-[260vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard title="MYSTIC INSIGHTS" codeName="PROJECT_ID: ORACLE_ENGINE" description="An AI-powered astrology platform featuring Palmistry (Image Processing) and NLP-based future insights." tags={['OpenCV', 'Next.js', 'Tailwind', 'NLP']} color="#00f3ff" position="right" image="https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=1000&auto=format&fit=crop" github="#" />
        </div>
        <div className="absolute top-[320vh] w-full px-8 md:px-20 pointer-events-none">
            <ProjectCard title="MIND MAZE" codeName="PROJECT_ID: COGNITIVE_GRID" description="A gamified education platform designed to increase student retention through interactive learning modules." tags={['MongoDB', 'Express', 'React', 'Node.js']} color="#0aff00" position="left" image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" github="#" demo="#" />
        </div>

        {/* STOP 4: STATS & YOUTUBE */}
        <div className="absolute top-[400vh] w-full px-8 md:px-32 pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 font-cyber text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              OPERATOR <span className="text-yellow-500">LOGS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pointer-events-auto">
                <AchievementCard title="ACADEMIC_PERFORMANCE" value="9.58 CGPA" subtext="B.Tech CSE (Sem IV) - High Distinction" icon={BookOpen} color="#0aff00" />
                <AchievementCard title="COMPETITIVE_EVENTS" value="SIH 2025 Qualified" subtext="Internal Rounds Cleared | Gen AI Showdown" icon={Trophy} color="#fbbf24" />
                <AchievementCard title="PHYSICAL_DIVISION" value="MU Football 2024" subtext="Represented Pillai College Team" icon={Activity} color="#ff003c" />
                <a href="https://youtube.com/@false-window" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative group bg-black/90 border border-red-600 p-6 rounded-xl hover:bg-red-900/20 transition-all duration-300 w-full backdrop-blur-sm cursor-pointer">
                    <div className="absolute top-4 right-4 animate-pulse"><Youtube size={40} color="#ff0000" /></div>
                    <div className="flex items-center gap-3 mb-2"><Youtube size={20} color="#ff0000" /><span className="font-mono text-xs text-red-400 tracking-widest">GENERATIVE_MEDIA</span></div>
                    <h3 className="text-2xl font-bold text-white font-cyber mb-1">FALSE WINDOW</h3>
                    <p className="text-sm text-gray-400 font-mono">AI Horror/Sci-Fi Storytelling Channel.</p>
                  </div>
                </a>
            </div>
        </div>

        {/* STOP 5: CONTACT (Correctly placed) */}
        <div className="absolute top-[500vh] w-full h-screen flex flex-col items-center justify-center text-center pointer-events-none pb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-cyber animate-pulse">
              ESTABLISH <span className="text-neon-cyan font-cyber"><GlitchText text="UPLINK" /></span>
            </h2>
            
            {/* THIS COMPONENT REPLACES THE OLD HTML FORM */}
            <ContactForm />

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
                <p className="mt-2 opacity-60">© 2025 ALL RIGHTS RESERVED // END_OF_LINE</p>
            </div>
        </div>



      </Scroll>

      {/* === HUD NAVIGATION (New Addition) === */}
      <HudNav />
      
    </>
  )
}

// --- 3. THE MAIN PAGE ---
export default function Home() {
  return (
    <main className="h-screen w-full bg-void-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <fog attach="fog" args={['#050505', 5, 60]} />

        {/* Post Processing (The Glow) */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.9} luminanceSmoothing={0.02} />
          <Noise opacity={0.05} />
          <ChromaticAberration offset={[0.002, 0.002]} />
        </EffectComposer>

        {/* *** THIS IS THE FIX: Pages set to 7 *** */}
        <ScrollControls pages={7} damping={0.2}>
          <CameraRig />
          <SceneContent />
        </ScrollControls>
        
      </Canvas>
    </main>
  )
}