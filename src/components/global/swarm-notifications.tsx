"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Bot, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

const NOTIFICATIONS = [
  {
    title: "Swarm Intelligence",
    description: "Competitor Analysis agent detected a new trending campaign in your niche.",
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    type: "info"
  },
  {
    title: "Content Agent",
    description: "Successfully drafted 3 thread concepts for Twitter/X.",
    icon: <CheckCircle2 className="w-4 h-4 text-secondary" />,
    type: "success"
  },
  {
    title: "Predictive ROI Engine",
    description: "Projected engagement for tomorrow's LinkedIn post has increased by 14%.",
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    type: "info"
  },
  {
    title: "Trends Scout",
    description: "Identified an emerging audio trend on TikTok relevant to your brand.",
    icon: <Bot className="w-4 h-4 text-pink-500" />,
    type: "info"
  }
]

export function SwarmNotifications() {
  useEffect(() => {
    // Simulate periodic swarm activity
    const interval = setInterval(() => {
      // 30% chance to show a notification every 15 seconds
      if (Math.random() > 0.7) {
        const randomNotif = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]
        
        toast(randomNotif.title, {
          description: randomNotif.description,
          icon: randomNotif.icon,
          className: "glass-card border-white/10 text-foreground"
        })
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return null
}
