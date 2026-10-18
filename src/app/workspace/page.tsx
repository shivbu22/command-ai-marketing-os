"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Save, ChevronRight, PenTool, Instagram, Twitter, Eye, Sparkles, Layout } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialMockups } from "@/components/previews/social-mockups"
import { motion, AnimatePresence } from "framer-motion"
import { PredictiveScore } from "@/components/workspace/predictive-score"

export default function WorkspacePage() {
  const [content, setContent] = useState(`The landscape of digital marketing is shifting fundamentally. We are moving away from manual tools and isolated workflows toward autonomous, interconnected systems. 

**The Swarm Concept**
Instead of a single AI assistant, imagine a swarm of specialized agents. One agent acts as the CMO, defining the strategy. Another is the SEO specialist, crunching numbers and finding keyword gaps. A third is the content creator. 

They don't just generate text; they orchestrate entire campaigns.

**Command-Driven Growth**
The interface becomes simple. You provide a command: "Launch product X to audience Y." The swarm takes over. 

1. Market Research agent gathers intel.
2. SEO agent builds the topic cluster.
3. Content agent drafts the collateral.
4. Social agent schedules the distribution.

This isn't the future—it's being built right now with platforms like Pixalified AI.`)

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center animate-slide-up">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Workspace</span>
          <ChevronRight className="w-4 h-4" />
          <span>Campaigns</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">App Launch Strategy</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-white/10 hover:border-primary/30 transition-all duration-300">
            <PenTool className="w-4 h-4" />
            Human Polish
          </Button>
          <Button size="sm" className="premium-button gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            Save to Brain
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Editor Main Area */}
        <div className="flex-1 flex flex-col space-y-4 animate-scale-in">
          <Card className="flex-1 flex flex-col glass-card rounded-3xl shadow-2xl overflow-hidden border-white/5 relative bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <CardHeader className="border-b border-white/5 glass py-4 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    defaultValue="Why AI Agents are the Future of Marketing"
                    className="bg-transparent border-none text-2xl font-bold focus:outline-none w-full placeholder:text-white/20"
                    placeholder="Document Title"
                  />
                  <p className="text-xs text-muted-foreground">Last updated 2 mins ago by Content Agent</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative z-10">
              <ScrollArea className="h-full">
                <Textarea 
                  className="w-full min-h-[500px] resize-none border-none focus-visible:ring-0 p-8 text-lg leading-relaxed bg-transparent font-sans"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Omnichannel Preview Panel */}
        <div className="w-[400px] flex flex-col glass-card rounded-3xl shrink-0 overflow-hidden animate-slide-up border-white/5 bg-black/40" style={{ animationDelay: '0.2s' }}>
          <Tabs defaultValue="suggestions" className="flex-1 flex flex-col">
            <div className="p-1.5 border-b border-white/5 glass bg-black/20">
              <TabsList className="w-full bg-white/5 rounded-2xl p-1 gap-1">
                <TabsTrigger value="suggestions" className="flex-1 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="previews" className="flex-1 rounded-xl data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary transition-all">
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  Previews
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="suggestions" className="flex-1 m-0 p-0 overflow-hidden outline-none">
              <ScrollArea className="h-[calc(100vh-16rem)] p-4">
                <div className="space-y-6">
                  <PredictiveScore score={92} reach="125K - 180K" alignment={98} />
                  <div className="h-px bg-white/5 mx-2" />
                  
                  <div className="p-4 bg-secondary/5 border border-secondary/15 rounded-2xl text-sm space-y-2 hover:bg-secondary/10 hover:border-secondary/25 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-secondary flex items-center gap-2">
                         <Instagram className="w-3.5 h-3.5" />
                         SEO Optimization
                      </p>
                      <span className="text-[10px] bg-secondary/10 px-2 py-0.5 rounded-full text-secondary">High Impact</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">Consider adding the keyword <span className="text-secondary font-medium italic">&quot;autonomous marketing swarm&quot;</span> in the second paragraph for 12% better reach.</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" size="sm" className="h-8 text-xs px-4 rounded-xl bg-secondary/15 text-secondary hover:bg-secondary border border-secondary/20 hover:text-white transition-all">Apply Change</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-4 rounded-xl hover:bg-white/5">Dismiss</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-2xl text-sm space-y-2 hover:bg-primary/10 hover:border-primary/25 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary flex items-center gap-2">
                         <Twitter className="w-3.5 h-3.5" />
                         Trend Alert
                      </p>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">LinkedIn engagement for &quot;AI Agency&quot; topics is up 45%. I can auto-generate a companion post for your feed.</p>
                    <Button size="sm" className="w-full mt-4 premium-button h-8 rounded-xl text-xs">Generate LinkedIn Post</Button>
                  </div>

                  <div className="p-4 border border-white/5 rounded-2xl text-sm space-y-3 bg-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="font-medium">Swarm Sentiment Check</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} className="h-full bg-secondary" />
                       </div>
                       <span className="text-xs font-bold text-secondary">88% Positive</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="previews" className="flex-1 m-0 p-0 overflow-hidden outline-none">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="p-4 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Instagram (Feed)</h4>
                    <SocialMockups content={content} platform="instagram" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">X / Twitter</h4>
                    <SocialMockups content={content} platform="x" />
                  </div>
                  <div className="space-y-4 pb-8">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">TikTok (FYP)</h4>
                    <SocialMockups content={content} platform="tiktok" />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
