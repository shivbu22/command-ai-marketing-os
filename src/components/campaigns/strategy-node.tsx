"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, CheckCircle2, Clock, GitCommit, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StrategyNodeProps {
  title: string
  role: string
  status: 'complete' | 'in-progress' | 'pending' | 'failed'
  progress?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function StrategyNode({ title, role, status, progress = 0, delay = 0, className, style }: StrategyNodeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'complete':
        return {
          badge: "bg-secondary/15 text-secondary border-secondary/20",
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
          card: "glow-secondary border-secondary/20",
          label: "Complete",
          accent: "text-secondary"
        }
      case 'in-progress':
        return {
          badge: "bg-primary/15 text-primary border-primary/20",
          icon: <GitCommit className="w-3 h-3 mr-1 animate-pulse" />,
          card: "glow-primary border-primary/30 animate-glow-pulse shadow-lg shadow-primary/10",
          label: progress > 0 ? `${progress}%` : "In Progress",
          accent: "text-primary"
        }
      case 'failed':
        return {
          badge: "bg-destructive/15 text-destructive border-destructive/20",
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          card: "border-destructive/30",
          label: "Failed",
          accent: "text-destructive"
        }
      default:
        return {
          badge: "text-muted-foreground border-white/10",
          icon: <Clock className="w-3 h-3 mr-1" />,
          card: "border-white/5 opacity-50",
          label: "Pending",
          accent: "text-muted-foreground"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.05 }}
      style={style}
      className={cn("w-64 cursor-pointer z-10", className)}
    >
      <Card className={cn("glass-card rounded-xl overflow-hidden transition-all duration-300 relative", config.card)}>
        {status === 'in-progress' && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-violet-500 shadow-[0_0_8px_rgba(224,64,251,0.5)] transition-all duration-300" style={{ width: `${progress}%` }} />
        )}
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={status === 'pending' ? 'outline' : 'secondary'} className={cn("h-5 text-[10px] font-bold uppercase tracking-wider", config.badge)}>
              {config.icon} {config.label}
            </Badge>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-lg",
              status === 'in-progress' ? "bg-primary/20 text-primary animate-pulse" : 
              status === 'complete' ? "bg-secondary/20 text-secondary" : "bg-muted/30 text-muted-foreground"
            )}>
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <h3 className={cn("font-semibold text-sm", config.accent)}>{title}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">{role}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
