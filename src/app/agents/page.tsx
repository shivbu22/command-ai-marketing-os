"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AgentsPage() {
  const [agents, setAgents] = useState<{
    id: string;
    name: string;
    description: string;
    status: string;
    active: boolean;
    gradient: string;
    emoji: string;
    role?: string;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents')
        if (res.ok) {
          const data = await res.json()
          
          // Map MongoDB data to frontend display properties
          const formattedAgents = data.map((agent: {
            _id: string;
            name: string;
            description?: string;
            status: string;
            emoji?: string;
            role?: string;
          }) => {
            // Assign gradient based on role for visual variety
            let gradient = "from-[#E040FB] to-[#FF6090]"
            if (agent.role === 'seo_engine' || agent.role === 'trend_scout') gradient = "from-[#FF9100] to-[#FFB300]"
            if (agent.role === 'social_manager') gradient = "from-[#1DA1F2] to-[#00BCD4]"
            if (agent.role === 'visual_ai') gradient = "from-[#4CAF50] to-[#8BC34A]"

            return {
              id: agent._id,
              name: agent.name,
              description: agent.description || "Marketing Agent",
              status: agent.status === 'active' ? 'Active' : 'Idle',
              active: agent.status === 'active',
              gradient,
              emoji: agent.emoji || "🤖"
            }
          })
          
          setAgents(formattedAgents)
        }
      } catch (error) {
        console.error("Error fetching agents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-white/5 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">AI Agents</h1>
          <p className="text-muted-foreground mt-1">Your autonomous social media marketing swarm.</p>
        </div>
        <Button className="bg-gradient-to-r from-[#E040FB] to-[#FF6090] hover:from-[#E040FB]/90 hover:to-[#FF6090]/90 text-white gap-2 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 rounded-xl">
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading swarm configuration...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 stagger-children">
          {agents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl glass-card">
              No agents deployed yet. Click &quot;Create Agent&quot; to expand your swarm.
            </div>
          ) : (
            agents.map((agent, i) => (
              <div key={agent.id || i} className="card-3d">
                <Card className="card-3d-inner flex flex-col glass-card relative overflow-hidden group cursor-pointer">
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${agent.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <span className="text-2xl">{agent.emoji}</span>
                      </div>
                      <Badge 
                        variant={agent.active ? "default" : "secondary"} 
                        className={agent.active 
                          ? "bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30" 
                          : "bg-muted/50 border border-border/30"
                        }
                      >
                        {agent.active && (
                          <span className="relative flex h-2 w-2 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                          </span>
                        )}
                        {agent.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-primary transition-colors duration-300">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <CardDescription className="text-sm leading-relaxed">
                      {agent.description}
                    </CardDescription>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5 hover:border-primary/30 transition-all duration-300">Configure</Button>
                      
                      {agent.role === 'social_manager' ? (
                        <Dialog>
                          <DialogTrigger 
                            render={
                              <Button variant="secondary" className="flex-1 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-300" />
                            }
                          >
                            <Sparkles className="w-3 h-3 mr-1" /> Batch
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Batch Concept Generator
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Triggering the Swarm to parallel-generate 5 omnichannel concepts based on current trends.
                              </p>
                              <div className="space-y-2">
                                {[1, 2, 3].map((step) => (
                                  <div key={step} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-medium">
                                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                      Generating Concept {step}...
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">Processing</Badge>
                                  </div>
                                ))}
                              </div>
                              <Button className="w-full premium-button rounded-xl mt-4" disabled>
                                Generating...
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button variant="secondary" className="flex-1 rounded-xl bg-white/5 text-foreground hover:bg-white/10 border border-white/5 transition-all duration-300">Logs</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            ))
          )}
        </div>
      )}
    </div>
  )
}
