"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize, Loader2, Sparkles, Network } from "lucide-react"
import { StrategyNode } from "@/components/campaigns/strategy-node"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string; status: string; roi: string }>>([]);
  const [loading, setLoading] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  
  const [nodes, setNodes] = useState([
    { id: 1, title: "Competitor Analysis", role: "Growth Agent", status: 'complete', progress: 100, x: 20, y: 40 },
    { id: 2, title: "Global Sentiment Audit", role: "Trends Agent", status: 'complete', progress: 100, x: 20, y: 340 },
    { id: 3, title: "Narrative Architecture", role: "Creative Director", status: 'in-progress', progress: 45, x: 480, y: 190 },
    { id: 4, title: "High-Fidelity Social Assets", role: "Content Agent", status: 'pending', progress: 0, x: 940, y: 40 },
    { id: 5, title: "Viral Loop Deployment", role: "Social Swarm", status: 'pending', progress: 0, x: 940, y: 340 },
  ])

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns")
        const data = await res.json()
        setCampaigns(data)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const launchSwarm = async () => {
    if (isExecuting) return
    setIsExecuting(true)

    // Reset nodes to a starting state for simulation
    setNodes(prev => prev.map(n => n.id > 2 ? { ...n, status: 'pending', progress: 0 } : n))

    const executeNode = async (id: number) => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'in-progress', progress: 0 } : n))
      
      for (let p = 0; p <= 100; p += 5) {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, progress: p } : n))
        await new Promise(r => setTimeout(r, 150))
      }

      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'complete', progress: 100 } : n))
    }

    await executeNode(3)
    await executeNode(4)
    await executeNode(5)
    
    setIsExecuting(false)
  }

  const currentCampaign = campaigns[0] || { name: "Quantum Launch Alpha", status: "active" }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Intelligence Mapping</h1>
          <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Visualizing Campaign Logic: <strong className="text-foreground">{currentCampaign.name}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-primary mt-2 mr-2" />}
          <Button variant="outline" size="sm" className="rounded-xl glass border-white/10 hover:border-primary/30">
            Export Graph
          </Button>
          <Button 
            onClick={launchSwarm}
            disabled={isExecuting}
            className={cn(
              "premium-button rounded-xl flex items-center gap-2 transition-all duration-500",
              isExecuting && "opacity-80 scale-95"
            )}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing Swarm...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Deploy Swarm
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-3xl overflow-hidden relative animate-scale-in border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        {/* Canvas Controls */}
        <div className="absolute top-6 right-6 flex gap-1 glass-card rounded-xl p-1.5 z-20 border-white/10">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-lg"><ZoomIn className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-lg"><ZoomOut className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-lg"><Maximize className="w-4 h-4" /></Button>
        </div>

        {/* Dynamic DAG Visualization */}
        <div className="absolute inset-0 overflow-auto p-12">
          <div className="relative w-[1100px] h-[700px] mx-auto mt-10">
            {/* SVG Connecting Lines with Animated Dash */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E040FB" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF6090" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Animation logic for lines based on node status */}
              <motion.path 
                d="M 280 100 L 480 250" 
                stroke="url(#edgeGrad)" 
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: nodes[2].status !== 'pending' ? 1 : 0, 
                  opacity: nodes[2].status !== 'pending' ? 1 : 0.2 
                }}
                transition={{ duration: 1 }}
                className="filter-[url(#glow)]"
                style={{ strokeDasharray: "8 8" }}
              />
              <motion.path 
                d="M 280 400 L 480 250" 
                stroke="url(#edgeGrad)" 
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: nodes[2].status !== 'pending' ? 1 : 0, 
                  opacity: nodes[2].status !== 'pending' ? 1 : 0.2 
                }}
                transition={{ duration: 1 }}
                style={{ strokeDasharray: "8 8" }}
              />
              <motion.path 
                d="M 740 250 L 940 100" 
                stroke={nodes[3].status === 'complete' ? "url(#edgeGrad)" : "rgba(255,255,255,0.1)"}
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: nodes[3].status !== 'pending' ? 1 : 0,
                  opacity: nodes[3].status !== 'pending' ? 1 : 0.2
                }}
                transition={{ duration: 1 }}
                style={{ strokeDasharray: "8 8" }}
              />
              <motion.path 
                d="M 740 250 L 940 400" 
                stroke={nodes[4].status === 'complete' ? "url(#edgeGrad)" : "rgba(255,255,255,0.1)"}
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: nodes[4].status !== 'pending' ? 1 : 0,
                  opacity: nodes[4].status !== 'pending' ? 1 : 0.2
                }}
                transition={{ duration: 1 }}
                style={{ strokeDasharray: "8 8" }}
              />
            </svg>

            {/* Strategy Nodes Mapping */}
            {nodes.map((node) => (
              <StrategyNode 
                key={node.id}
                title={node.title} 
                role={node.role} 
                status={node.status as any} 
                progress={node.progress}
                delay={0}
                className="absolute"
                style={{ top: `${node.y}px`, left: `${node.x}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
