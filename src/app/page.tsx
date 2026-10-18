"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Users, FileText, MousePointerClick, TrendingUp, ArrowUpRight, Heart, Share2, MessageCircle, Eye, Loader2, Bot, Sparkles } from "lucide-react"
import { CountUp } from "@/components/ui/count-up"
import { StatSkeleton, CardSkeleton, PremiumSkeleton } from "@/components/ui/skeleton-loader"
import { motion, AnimatePresence } from "framer-motion"

// Define types for the dashboard data
interface Kpi {
  title: string;
  value: number;
  change: string;
  up: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  shadow: string;
}

interface SocialPost {
  title: string;
  platform: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  trend: string;
  gradient: string;
}

interface FeedItem {
  id: string;
  agent?: string;
  agentRole?: string;
  message?: string;
  task?: string;
  createdAt?: string;
}

interface Signal {
  platform: string;
  message: string;
  user: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [pulseRecommendation, setPulseRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      // Simulate fetching data
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay

      setKpis([
        { title: "Total Users", value: 2450, change: "+12% from last month", up: true, icon: Users, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
        { title: "Engagement Rate", value: 18.5, change: "+5% from last month", up: true, icon: MousePointerClick, color: "from-green-500 to-green-600", shadow: "shadow-green-500/30" },
        { title: "Content Published", value: 128, change: "+8% from last month", up: true, icon: FileText, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/30" },
        { title: "Trend Score", value: 7.2, change: "+1.5 from last month", up: true, icon: TrendingUp, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-500/30" },
      ])

      setSocialPosts([
        { title: "Our latest AI-powered marketing campaign is live!", platform: "Twitter", views: "12.5K", likes: "890", comments: "120", shares: "340", trend: "+15%", gradient: "from-sky-400 to-blue-500" },
        { title: "Behind the scenes: How our AI agents craft compelling content.", platform: "LinkedIn", views: "8.2K", likes: "650", comments: "85", shares: "210", trend: "+10%", gradient: "from-indigo-400 to-purple-500" },
        { title: "New feature alert! Predictive analytics for your next viral post.", platform: "Facebook", views: "15.1K", likes: "1.1K", comments: "150", shares: "400", trend: "+18%", gradient: "from-pink-400 to-red-500" },
        { title: "The future of social media is autonomous. Are you ready?", platform: "Instagram", views: "9.8K", likes: "720", comments: "95", shares: "280", trend: "+12%", gradient: "from-yellow-400 to-orange-500" },
      ])

      setFeedItems([
        { id: "1", agent: "Content Creator", task: "Drafting blog post on 'AI in Marketing'", createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
        { id: "2", agentRole: "Social Media Manager", message: "Scheduled 3 posts for Twitter", createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { id: "3", agent: "Trend Analyst", task: "Identified 'Sustainable Tech' as emerging trend", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
        { id: "4", agentRole: "Campaign Optimizer", message: "Adjusted ad spend for Facebook campaign", createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
      ])

      setSignals([
        { platform: "Twitter", message: "User @techguru: 'Mind-blown by the new AI content generation tools!'", user: "@techguru", createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
        { platform: "Reddit", message: "r/marketing: 'Anyone else seeing huge ROI from autonomous marketing platforms?'", user: "u/marketingpro", createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString() },
        { platform: "News", message: "Forbes: 'The rise of AI in social media marketing'", user: "Forbes", createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
      ])

      setPulseRecommendation("Consider A/B testing a new call-to-action on your LinkedIn posts to improve click-through rates by 15%.")

      setIsLoading(false)
    }

    fetchDashboardData()

    // Subscribe to SSE for live updates
    const eventSource = new EventSource("/api/feed/sse")
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'connected') return
      
      if (data.type === 'autonomous_thought') {
        setPulseRecommendation(data.message)
        return
      }

      if (data.type === 'external_signal') {
        setSignals((prev) => [data, ...prev].slice(0, 5))
        return
      }

      setFeedItems((prev) => {
        if (prev.some(job => job.id === data.id)) return prev
        return [data, ...prev].slice(0, 10)
      })
    }

    return () => eventSource.close()
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your social media marketing performance at a glance.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            All Agents Active
          </div>
        </div>

        <PremiumSkeleton />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <CardSkeleton className="col-span-4 h-[400px]" />
          <div className="col-span-3 space-y-6">
            <CardSkeleton className="h-[300px]" />
            <CardSkeleton className="h-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your social media marketing performance at a glance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          All Agents Active
        </div>
      </div>

      {/* Autonomous Pulse Recommendation */}
      <AnimatePresence mode="wait">
        {pulseRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="p-4 glass-card rounded-2xl border-primary/20 bg-primary/5 flex items-center justify-between group overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg animate-pulse">
                     <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Live AI Recommendation</p>
                    <p className="text-sm font-medium text-foreground">{pulseRecommendation}</p>
                  </div>
               </div>
               <Button size="sm" className="premium-button rounded-xl text-xs h-8 relative z-10">Optimize Now</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        {kpis.map((kpi, i) => (
          <div key={i} className="card-3d">
            <Card className="card-3d-inner glass-card relative overflow-hidden group cursor-pointer">
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${kpi.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} ${kpi.shadow} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  <CountUp value={kpi.value} suffix={kpi.title.includes("Rate") ? "%" : ""} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-secondary" />
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Social Posts */}
        <Card className="col-span-4 glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Top Social Posts
            </CardTitle>
            <CardDescription>AI-generated content performance across platforms.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {socialPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No posts created yet. Open the Console to launch a campaign!</div>
              ) : (
                socialPosts.map((post, i) => (
                  <div key={i} className="flex items-center group hover:bg-white/5 rounded-xl p-4 -mx-4 transition-all duration-300 cursor-pointer border border-transparent hover:border-white/5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{post.title}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{post.platform}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                        <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {post.shares}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-bold text-secondary">{post.trend}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Agent Activity Feed */}
        <div className="col-span-3 space-y-6">
          <Card className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Agent Activity Feed
              </CardTitle>
              <CardDescription>Live updates from your AI marketing swarm.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {feedItems.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">Waiting for swarm activity...</div>
                ) : (
                  feedItems.map((item, i: number) => (
                    <div key={i} className="flex items-center group hover:bg-white/5 rounded-lg p-2 -mx-2 transition-all duration-300 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Bot className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors truncate">
                          {item.agent || item.agentRole?.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.message || item.task}</p>
                      </div>
                      <div className="ml-auto text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.createdAt ? formatTime(item.createdAt) : "Just now"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Global Signals Feed */}
          <Card className="glass-card overflow-hidden border-secondary/20 bg-secondary/5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Global Social Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {signals.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground text-center py-4">Synchronizing with external ecosystems...</p>
                ) : (
                  signals.map((sig, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 rounded-lg bg-black/20 border border-white/5 space-y-1 relative group"
                    >
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-secondary font-black tracking-tighter uppercase">{sig.platform}</span>
                        <span className="text-muted-foreground font-mono">{formatTime(sig.createdAt)}</span>
                      </div>
                      <p className="text-[11px] leading-tight font-medium text-white/90">{sig.message}</p>
                      <p className="text-[9px] text-muted-foreground">Source: <span className="text-primary/70">{sig.user}</span></p>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
