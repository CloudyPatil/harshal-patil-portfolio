'use client'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault() // Stop page reload
    setStatus('sending')

    // 🚨 ENSURE THESE ARE STILL YOUR ACTUAL IDS
    const SERVICE_ID = 'YOUR_SERVICE_ID' // Replace if you haven't yet
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

    if(formRef.current) {
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
        .then(() => {
          setStatus('success')
          
          // ⬇️⬇️⬇️ THIS IS THE FIX ⬇️⬇️⬇️
          // This line wipes the inputs clean immediately
          formRef.current?.reset(); 
          // ⬆️⬆️⬆️ THIS IS THE FIX ⬆️⬆️⬆️

          // Reset button state after 3 seconds
          setTimeout(() => setStatus('idle'), 3000)
        }, (error) => {
          console.log(error.text)
          setStatus('error')
          setTimeout(() => setStatus('idle'), 3000)
        })
    }
  }

  return (
    <form ref={formRef} onSubmit={sendEmail} className="bg-black/80 border border-neon-cyan p-8 w-full max-w-md rounded-lg backdrop-blur-xl shadow-[0_0_50px_rgba(0,243,255,0.1)] pointer-events-auto text-left">
      
      {/* Header Info */}
      <div className="flex justify-between mb-6 text-xs font-mono text-neon-cyan opacity-70">
        <span>SECURE_CONNECTION_V4.0</span>
        <span>LATENCY: 12ms</span>
      </div>

      <div className="space-y-6">
         {/* Name Input */}
         <div>
            <label className="text-xs font-mono text-gray-500 block mb-1"> - ENTER_IDENTITY</label>
            <input 
              required 
              type="text" 
              name="from_name" 
              placeholder="Name / Org" 
              className="w-full bg-gray-900/50 border-b border-gray-700 text-white font-mono p-2 focus:border-neon-cyan focus:outline-none transition-colors" 
            />
         </div>

         {/* Email Input */}
         <div>
            <label className="text-xs font-mono text-gray-500 block mb-1"> - ENTER_FREQUENCY</label>
            <input 
              required 
              type="email" 
              name="from_email" 
              placeholder="Email Address" 
              className="w-full bg-gray-900/50 border-b border-gray-700 text-white font-mono p-2 focus:border-neon-cyan focus:outline-none transition-colors" 
            />
         </div>

         {/* Message Input */}
         <div>
            <label className="text-xs font-mono text-gray-500 block mb-1"> - TRANSMISSION_DATA</label>
            <textarea 
              required 
              name="message" 
              rows={3} 
              placeholder="Message..." 
              className="w-full bg-gray-900/50 border-b border-gray-700 text-white font-mono p-2 focus:border-neon-cyan focus:outline-none transition-colors"
            ></textarea>
         </div>
      </div>

      {/* Dynamic Button */}
      <button 
        type="submit" 
        disabled={status === 'sending' || status === 'success'}
        className={`w-full mt-8 font-bold py-3 font-cyber transition-all uppercase tracking-widest flex items-center justify-center gap-2
          ${status === 'idle' ? 'bg-neon-cyan text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(0,243,255,0.4)]' : ''}
          ${status === 'sending' ? 'bg-gray-700 text-gray-400 cursor-wait' : ''}
          ${status === 'success' ? 'bg-neon-green text-black' : ''}
          ${status === 'error' ? 'bg-red-600 text-white' : ''}
        `}
      >
        {status === 'idle' && <><Send size={16} /> [ EXECUTE_TRANSMISSION ]</>}
        {status === 'sending' && <>UPLOADING DATA...</>}
        {status === 'success' && <><CheckCircle size={16} /> TRANSMISSION COMPLETE</>}
        {status === 'error' && <><AlertCircle size={16} /> ERROR: RETRY</>}
      </button>

    </form>
  )
}