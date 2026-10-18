"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Instagram, Twitter, Linkedin, Zap, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

// Mock Data for the Calendar
const mockEvents = [
  {
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    platform: "Twitter",
    content: "Why Sustainable AI is the future. [Thread]",
    status: "scheduled",
    category: "thought-leadership",
    time: "10:00 AM"
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    platform: "LinkedIn",
    content: "Case Study: Reducing latency by 40% with edge computing.",
    status: "draft",
    category: "case-study",
    time: "2:00 PM"
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    platform: "Instagram",
    content: "Behind the scenes at Pixalified HQ 🚀",
    status: "scheduled",
    category: "culture",
    time: "11:30 AM"
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    platform: "Twitter",
    content: "New feature drop: Swarm Autonomy is here.",
    status: "published",
    category: "product",
    time: "9:00 AM"
  }
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { days, firstDay }
  }

  const { days, firstDay } = getDaysInMonth(currentDate)
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter': return <Twitter className="w-3 h-3 text-sky-400" />
      case 'Instagram': return <Instagram className="w-3 h-3 text-pink-400" />
      case 'LinkedIn': return <Linkedin className="w-3 h-3 text-blue-500" />
      default: return <Zap className="w-3 h-3 text-primary" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none scale-75 origin-left px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/>Published</Badge>
      case 'scheduled': return <Badge className="bg-primary/20 text-primary border-none scale-75 origin-left px-1.5"><Clock className="w-3 h-3 mr-1"/>Scheduled</Badge>
      case 'draft': return <Badge variant="outline" className="text-muted-foreground border-white/10 scale-75 origin-left px-1.5">Draft</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Omnichannel Calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm">Unified orchestration of all scheduled intelligent agents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl glass border-white/10 hover:border-primary/30">
            List View
          </Button>
          <Button className="premium-button rounded-xl flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Schedule Draft
          </Button>
        </div>
      </motion.div>

      <div className="glass-card rounded-3xl overflow-hidden p-6 border-white/5 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay" />
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-1 glass rounded-lg p-1 border-white/10">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 hover:bg-white/10 rounded-md">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="h-8 hover:bg-white/10 rounded-md px-3 text-xs font-medium">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 hover:bg-white/10 rounded-md">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-4 mb-4 relative z-10">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-[11px] font-black text-muted-foreground tracking-widest uppercase py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 relative z-10 focus-within:ring-0">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[140px] rounded-2xl bg-white/[0.02] border border-white/5 opacity-30" />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const dateNumber = i + 1
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), dateNumber).toISOString().split('T')[0]
            const dayEvents = mockEvents.filter(e => e.date === dateStr)
            const isToday = dateStr === new Date().toISOString().split('T')[0]

            return (
              <motion.div 
                key={dateNumber} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={cn(
                  "min-h-[140px] rounded-2xl border p-2 flex flex-col gap-1 transition-all duration-300 group hover:bg-white/[0.03]",
                  isToday ? "border-primary/40 bg-primary/5 shadow-[0_0_15px_rgba(224,64,251,0.1)]" : "border-white/5 bg-white/[0.01]"
                )}
              >
                <div className="flex justify-between items-start mb-1 h-6">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isToday ? "bg-primary text-white shadow-[0_0_10px_rgba(224,64,251,0.5)]" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {dateNumber}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-md">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                  {dayEvents.map((event, idx) => (
                    <div 
                      key={idx} 
                      className="text-xs p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/event focus:outline-none focus:ring-2 focus:ring-primary/50"
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${event.platform} post: ${event.content}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5 opacity-70 group-hover/event:opacity-100 transition-opacity">
                          {getPlatformIcon(event.platform)}
                          <span className="font-medium text-[10px]">{event.time}</span>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-foreground/80 leading-tight mb-1 font-medium">{event.content}</p>
                      <div className="-ml-1">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
