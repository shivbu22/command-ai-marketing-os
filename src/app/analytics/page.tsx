"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp, 
  Loader2, 
  Twitter, 
  Trophy, 
  Sparkles, 
  Download,
  LucideIcon
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CountUp } from "@/components/ui/count-up"
import { StatSkeleton, CardSkeleton, PremiumSkeleton } from "@/components/ui/skeleton-loader"
import { motion } from "framer-motion"

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-sm font-semibold">
                {entry.name}: <span className="text-primary">{entry.value.toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface IKPI {
  title: string;
  value: number;
  change: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
  shadow: string;
}

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<IKPI[]>([])
  const [topContent, setTopContent] = useState<Array<{
    id?: string;
    title: string;
    platform: string;
    views?: number;
    reach?: number;
    engagement: number;
    trend?: string;
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [overviewRes, topPostsRes] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch('/api/content/top')
        ])

        if (overviewRes.ok && topPostsRes.ok) {
          const overviewData = await overviewRes.json()
          const topPostsData = await topPostsRes.json()

          setKpis([
            { title: "Total Reach", value: overviewData.totalReach.value, change: overviewData.totalReach.trend, up: overviewData.totalReach.isPositive, icon: Eye, color: "from-[#E040FB] to-[#FF6090]", shadow: "shadow-pink-500/20" },
            { title: "Engagement Rate", value: overviewData.engagementRate.value, change: overviewData.engagementRate.trend, up: overviewData.engagementRate.isPositive, icon: Heart, color: "from-[#FF6090] to-[#FF9100]", shadow: "shadow-orange-500/20" },
            { title: "Content Created", value: overviewData.contentCreated.value, change: overviewData.contentCreated.trend, up: overviewData.contentCreated.isPositive, icon: Activity, color: "from-[#1DA1F2] to-[#00BCD4]", shadow: "shadow-cyan-500/20" },
            { title: "Viral Score", value: overviewData.viralScore.value, change: overviewData.viralScore.trend, up: overviewData.viralScore.isPositive, icon: TrendingUp, color: "from-[#4CAF50] to-[#8BC34A]", shadow: "shadow-green-500/20" },
          ])

          setTopContent(topPostsData)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      // Simulate download
      const element = document.createElement("a");
      const file = new Blob(["Campaign Performance Report - Pixalified AI"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "Pixalified_ROI_Report.pdf";
      document.body.appendChild(element);
      // We'll just show a success message in a real app, here we simulate the feel
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
         <div className="flex justify-between items-center">
            <div className="space-y-2">
              <PremiumSkeleton className="h-8 w-48" />
              <PremiumSkeleton className="h-4 w-64" />
            </div>
            <PremiumSkeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
      </div>
    )
  }

  // Mock charts
  const engagementData = [
    { name: 'Mon', reach: 4000, engagement: 2400 },
    { name: 'Tue', reach: 3000, engagement: 1800 },
    { name: 'Wed', reach: 5000, engagement: 3200 },
    { name: 'Thu', reach: 2780, engagement: 1890 },
    { name: 'Fri', reach: 8900, engagement: 5600 },
    { name: 'Sat', reach: 6390, engagement: 4100 },
    { name: 'Sun', reach: 7490, engagement: 4800 },
  ]

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Social Analytics</h1>
          <p className="text-muted-foreground mt-1">Cross-platform performance insights powered by AI swarm.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Live AI Analysis
          </div>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="premium-button rounded-xl flex items-center gap-2 group"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />}
            {isExporting ? "Archiving..." : "Export Report"}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-3d"
          >
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
                <p className={`text-xs flex items-center mt-1 ${kpi.up ? 'text-secondary' : 'text-destructive'}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="h-full"
        >
          <Card className="glass-card rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary font-bold"><Share2 className="w-5 h-5" /> Analytics Overview</CardTitle>
              <CardDescription>Daily social media reach vs engagement.</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E040FB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E040FB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6090" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6090" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border/20" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground text-[10px]" tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground text-[10px]" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="reach" stroke="#E040FB" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                  <Area type="monotone" dataKey="engagement" stroke="#FF6090" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 }}
           className="h-full"
        >
          <Card className="glass-card rounded-2xl overflow-hidden h-full relative">
            <div className="absolute top-2 right-2 flex gap-1">
               <Badge className="bg-secondary/20 text-secondary border-none text-[8px] animate-pulse">PREDICTIVE</Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-secondary font-bold"><TrendingUp className="w-5 h-5" /> 7-Day ROI Projection</CardTitle>
              <CardDescription>AI-driven reach forecasting with 92% confidence.</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...engagementData, 
                  { name: 'Mon (P)', reach: 8200, engagement: 5100 },
                  { name: 'Tue (P)', reach: 9800, engagement: 6200 },
                  { name: 'Wed (P)', reach: 11500, engagement: 7400 }
                ]}>
                  <defs>
                    <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/10" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground text-[10px]" tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground text-[10px]" tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="reach" stroke="#1DA1F2" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjection)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-8"
        >
          <Card className="glass-card rounded-2xl overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 glass text-sm font-medium text-muted-foreground rounded-xl mb-2">
                    <div className="col-span-5">Content</div>
                    <div className="col-span-2">Platform</div>
                    <div className="col-span-2">Reach</div>
                    <div className="col-span-2">Engagement</div>
                    <div className="col-span-1 text-right">Trend</div>
                  </div>
                  <div className="divide-y divide-white/5 text-sm stagger-children">
                    {topContent.length === 0 ? (
                      <div className="col-span-12 py-8 text-center text-muted-foreground">No published content found.</div>
                    ) : (
                      topContent.map((item, i) => (
                        <div key={item.id || i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-all duration-300 cursor-pointer rounded-lg group">
                          <div className="col-span-5 font-medium group-hover:text-primary transition-colors">{item.title}</div>
                          <div className="col-span-2 text-muted-foreground flex items-center gap-2 uppercase text-[10px] tracking-tighter font-black">
                            {item.platform === 'Twitter' ? <Twitter className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                            {item.platform}
                          </div>
                          <div className="col-span-2 font-medium">{item.views || item.reach}</div>
                          <div className="col-span-2 font-medium text-primary">{item.engagement}</div>
                          <div className="col-span-1 text-right font-bold text-secondary">{item.trend || "New"}</div>
                        </div>
                      ))
                    )}
                  </div>
              </CardContent>
          </Card>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="md:col-span-4"
        >
          <Card className="glass-card rounded-2xl overflow-hidden h-full border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-bold"><Sparkles className="w-5 h-5" /> Swarm Intelligence</CardTitle>
              <CardDescription>AI-generated content recommendations for next 24h.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl glass border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary font-bold">TREND ALERT</span>
                  <span className="text-muted-foreground">High Priority</span>
                </div>
                <p className="text-sm font-medium">&quot;Sustainable AI&quot; is trending in your niche. Your swarm recommends a TikTok/Reels push.</p>
                <Button variant="link" className="p-0 h-auto text-primary text-xs flex items-center gap-1">
                  Generate Draft <ArrowUpRight className="w-3 h-3" />
                </Button>
              </div>

              <div className="p-4 rounded-xl glass border-white/10 space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                 <div className="flex justify-between items-center text-xs">
                  <span className="text-primary font-bold">PEAK ENGAGEMENT</span>
                  <span className="text-muted-foreground">Tomorrow 10:00 AM</span>
                </div>
                <p className="text-sm font-medium">Projected +24% click-through rate for X (Twitter) threads during this window.</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Confidence Level</span>
                    <span className="text-xs font-bold text-primary">94%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "94%" }}
                      className="h-full bg-primary"
                    />
                 </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
