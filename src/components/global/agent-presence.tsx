"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Bot, Sparkles, Activity, ShieldCheck, Zap, Search } from "lucide-react"

const AGENTS = [
  { id: 'content_creator', name: 'Content Creator', icon: Bot, color: 'text-pink-500' },
  { id: 'trend_scout', name: 'Trend Scout', icon: Search, color: 'text-emerald-500' },
  { id: 'seo_engine', name: 'SEO Engine', icon: Activity, color: 'text-cyan-500' },
  { id: 'social_manager', name: 'Social Manager', icon: ShieldCheck, color: 'text-violet-500' },
  { id: 'image_creator', name: 'Visual Artist', icon: Zap, color: 'text-orange-500' },
]

export function AgentPresence() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [thought, setThought] = useState<string | null>(null)

  useEffect(() => {
    // Simulate real-time activity
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)]
        setActiveAgentId(randomAgent.id)
        
        const thoughts = [
          "Analyzing engagement...",
          "Indexing brand logic...",
          "Scanning TikTok feed...",
          "Optimizing reach...",
          "Generating concept...",
          "Waiting for input..."
        ]
        setThought(thoughts[Math.floor(Math.random() * thoughts.length)])
      } else {
        setActiveAgentId(null)
        setThought(null)
      }
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Live Swarm Presence</h4>
        <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      
      <div className="flex -space-x-2 overflow-hidden px-2">
        {AGENTS.map((agent) => {
          const isActive = activeAgentId === agent.id
          const Icon = agent.icon
          
          return (
            <motion.div
              key={agent.id}
              initial={false}
              animate={{
                scale: isActive ? 1.2 : 1,
                zIndex: isActive ? 20 : 0,
                borderWidth: isActive ? 2 : 1
              }}
              className={`relative h-10 w-10 rounded-xl glass border-white/10 flex items-center justify-center bg-background/40 backdrop-blur-md transition-shadow duration-500 ${isActive ? `shadow-[0_0_20px_rgba(0,0,0,0.5)] border-primary/50` : ''}`}
            >
              <Icon className={`h-5 w-5 ${isActive ? agent.color : 'text-muted-foreground/50'}`} />
              {isActive && (
                <motion.div 
                  layoutId="glow"
                  className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {activeAgentId && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="px-2"
          >
            <div className="flex items-center gap-2">
               <div className="text-[11px] font-medium text-primary">
                 {AGENTS.find(a => a.id === activeAgentId)?.name}
               </div>
               <div className="h-1 w-1 rounded-full bg-white/20" />
               <div className="text-[11px] text-muted-foreground italic truncate">
                 {thought}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
