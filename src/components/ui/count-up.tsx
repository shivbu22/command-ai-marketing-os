"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform, animate } from "framer-motion"

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
}

export function CountUp({ value, prefix = "", suffix = "", duration = 1.5, decimals = 0 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: duration,
      onUpdate(value) {
        setDisplayValue(value)
      },
      ease: "easeOut",
    })
    return () => controls.stop()
  }, [value, duration])

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
