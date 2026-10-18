"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-white/5", className)} />
  )
}

export function PremiumSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-white/5", className)}>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
      />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 glass-card rounded-2xl space-y-4">
      <div className="flex items-center gap-4">
        <PremiumSkeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <PremiumSkeleton className="h-4 w-1/3" />
          <PremiumSkeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <PremiumSkeleton className="h-4 w-full" />
        <PremiumSkeleton className="h-4 w-full" />
        <PremiumSkeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <PremiumSkeleton className="w-10 h-10 rounded-xl" />
        <PremiumSkeleton className="w-16 h-4" />
      </div>
      <PremiumSkeleton className="h-8 w-1/2 mb-2" />
      <PremiumSkeleton className="h-3 w-1/3" />
    </div>
  )
}
