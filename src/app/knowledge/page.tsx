"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, FileText, Link as LinkIcon, Image as ImageIcon, Search, MoreVertical, RefreshCw, CheckCircle2, Loader2 } from "lucide-react"

export default function KnowledgeBasePage() {
  const [assets, setAssets] = useState<{
    id?: string;
    name: string;
    type: string;
    size: string;
    status: string;
    createdAt: string;
  }[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Style Guides", "Datasets", "URLs", "Media"]

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/knowledge")
        const data = await res.json()
        setAssets(data)
      } catch (error) {
        console.error("Failed to fetch assets:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf": return FileText
      case "url": return LinkIcon
      case "media": return ImageIcon
      default: return FileText
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Intelligence Memory</h1>
          <p className="text-muted-foreground mt-1 text-sm">Synchronize brand assets with your AI Swarm for retrieval-augmented generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search brand memory..." className="pl-9 bg-background/50 border-white/10 rounded-xl" />
          </div>
          <Button className="premium-button rounded-xl flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Deep Sync
          </Button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="ghost"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-1.5 h-auto text-xs transition-all duration-300 ${activeCategory === cat ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg' : 'hover:bg-white/5'}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-primary/30 rounded-3xl p-10 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer group animate-scale-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500 animate-float relative z-10">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2 relative z-10">Expand Your Brand's Brain</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-sm relative z-10">Drop PDFs, Guidelines, or past campaigns. Our agents will vectorize and index them for zero-shot accuracy.</p>
        <div className="flex gap-4 relative z-10">
          <Button variant="outline" className="rounded-xl border-white/10 hover:border-primary/30 glass">Browse Files</Button>
          <Button className="rounded-xl bg-white text-black hover:bg-white/90 font-bold px-6">Index URL</Button>
        </div>
      </div>

      {/* Asset List */}
      <Card className="glass-card rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-0">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 glass text-sm font-medium text-muted-foreground">
            <div className="col-span-1"></div>
            <div className="col-span-5">Asset Name</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Priority</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-white/5 stagger-children">
            {loading ? (
              <div className="p-8 flex items-center justify-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Synchronizing memory...
              </div>
            ) : assets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No assets found.</div>
            ) : (
              assets
                .filter(asset => {
                  if (activeCategory === "All") return true;
                  if (activeCategory === "Style Guides") return asset.type === "pdf" && asset.name.toLowerCase().includes("style");
                  if (activeCategory === "Datasets") return asset.type === "data";
                  if (activeCategory === "URLs") return asset.type === "url";
                  if (activeCategory === "Media") return asset.type === "media";
                  return true;
                })
                .map((asset: {
                  id?: string;
                  name: string;
                  type: string;
                  size: string;
                  status: string;
                  createdAt: string;
                }, i) => {
                const Icon = getIcon(asset.type)
                const isPriority = asset.name.toLowerCase().includes("style");
                
                return (
                  <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                    <div className="col-span-1 flex justify-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="col-span-5 flex flex-col">
                      <span className="font-medium truncate group-hover:text-primary transition-colors">{asset.name}</span>
                      <span className="text-[10px] text-muted-foreground">{asset.size}</span>
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground font-mono">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">
                      {asset.status === 'Vectorized' ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Vectorized</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-[10px]"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isPriority ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] scale-110' : 'bg-white/10'}`} />
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
