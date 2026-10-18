"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Terminal, 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Database, 
  LineChart, 
  Settings,
  Sparkles
} from "lucide-react"

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const toggle = useCallback(() => setIsOpen(open => !open), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])

  const navigate = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  const actions = [
    { icon: LayoutDashboard, label: "Go to Dashboard", path: "/" },
    { icon: Terminal, label: "Open Command Console", path: "/console" },
    { icon: Users, label: "Manage Agents", path: "/agents" },
    { icon: Database, label: "Knowledge Base", path: "/knowledge" },
    { icon: Megaphone, label: "Active Campaigns", path: "/campaigns" },
    { icon: LineChart, label: "View Analytics", path: "/analytics" },
    { icon: Settings, label: "User Settings", path: "/settings" },
  ]

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[20vh] z-[101] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl glass-card rounded-2xl overflow-hidden pointer-events-auto shadow-2xl border-white/10"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input 
                  autoFocus
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-lg flex-1 text-foreground placeholder:text-muted-foreground/50"
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">ESC</span>
                </kbd>
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto">
                <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Navigation</p>
                {filtered.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-sm group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-left font-medium">{action.label}</span>
                    <Sparkles className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                {filtered.length === 0 && (
                   <div className="py-12 text-center text-muted-foreground">
                      <p>No results found for &quot;{query}&quot;</p>
                   </div>
                )}
              </div>

              <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex gap-4">
                   <span className="flex items-center gap-1"><span className="p-0.5 border border-white/10 rounded">↑↓</span> Navigate</span>
                   <span className="flex items-center gap-1"><span className="p-0.5 border border-white/10 rounded">ENTER</span> Select</span>
                </div>
                <div className="flex items-center gap-2">
                   <Terminal className="w-3 h-3" />
                   <span>Pixalified OS v1.0.4</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
