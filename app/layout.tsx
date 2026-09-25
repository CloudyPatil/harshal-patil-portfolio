import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const orbitron = localFont({ src: '../public/fonts/orbitron-latin.woff2', variable: '--font-orbitron', display: 'swap', weight: '400 900' })

export const metadata: Metadata = {
  title: 'Harshal Patil | Full Stack Developer & AI Builder',
  description: 'Harshal Patil builds full-stack products and applied AI systems. Explore RecruitAI, TRADEDO, Presente, experience, and selected work.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={orbitron.variable}>{children}</body></html>
}
