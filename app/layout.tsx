import "./globals.css"; 
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import React from "react";
import CursorComet from "./CursorComet"; // Importing the new cursor

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: "Harshal | Cyberpunk Portfolio",
  description: "Interactive 3D Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 'cursor-none' hides the default Windows arrow */}
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-black text-white cursor-none`}>
        
        {/* The Custom Comet Cursor sits on top of everything */}
        <CursorComet />

        {children}
      </body>
    </html>
  );
}