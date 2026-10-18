"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Target, Zap } from "lucide-react"

interface PredictiveScoreProps {
  score: number;
  reach: string;
  alignment: number;
}

export function PredictiveScore({ score, reach, alignment }: PredictiveScoreProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Predictive ROI Engine</h4>
        <Zap className="w-3 h-3 text-primary animate-pulse" />
      </div>

      <div className="relative flex items-center justify-center py-6">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={364.4}
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E040FB" />
              <stop offset="100%" stopColor="#FF6090" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold gradient-text">{score}%</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Viral Index</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl glass border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
            <Users className="w-3 h-3 text-cyan-400" />
            Est. Reach
          </div>
          <div className="text-sm font-bold text-foreground">{reach}</div>
        </div>
        <div className="p-3 rounded-xl glass border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
            <Target className="w-3 h-3 text-emerald-400" />
            Alignment
          </div>
          <div className="text-sm font-bold text-foreground">{alignment}%</div>
        </div>
      </div>

      <div className="p-4 rounded-xl liquid-glass space-y-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-2 mb-1">
           <TrendingUp className="w-4 h-4 text-primary" />
           <span className="text-xs font-bold text-foreground">Next-Gen Prediction</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Based on 2.4B data points, this content is predicted to over-perform by 22% in the first 4 hours.
        </p>
      </div>
    </div>
  )
}
