"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, 
  User, 
  Zap, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Loader2, 
  ChevronRight,
  Sparkles,
  Share2,
  Calendar
} from "lucide-react"

export default function CommandConsolePage() {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [feed, setFeed] = useState<Array<{ id: string; message?: string; command?: string; agentResponse?: string; agentRole?: string; createdAt: string; status?: string }>>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchInitialFeed = async () => {
    try {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setFeed(data);
    } catch (error) {
      console.error("Failed to fetch initial feed:", error);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchInitialFeed();

    // Subscribe to SSE for live updates
    const eventSource = new EventSource("/api/feed/sse");

    eventSource.onmessage = (event) => {
      const newJob = JSON.parse(event.data);
      if (newJob.type === 'connected') return;
      
      setFeed((prev) => {
        if (prev.some(job => job.id === newJob.id)) return prev;
        return [newJob, ...prev];
      });
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    setAgentResponse(null);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      
      if (!res.ok) throw new Error("Agent execution failed");
      
      const data = await res.json();
      setAgentResponse(data.content);
      setCommand("");
    } catch (error) {
       console.error(error);
       setAgentResponse("Error: Unable to coordinate with the AI swarm.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (platform: string) => {
    setIsPublishing(true);
    setPublishStatus('idle');
    try {
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          platform,
          content: agentResponse 
        }),
      });

      if (res.ok) {
        setPublishStatus('success');
        setTimeout(() => setPublishStatus('idle'), 3000);
      } else {
        setPublishStatus('error');
      }
    } catch (error) {
      console.error("Publish error:", error);
      setPublishStatus('error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Command Console</h1>
        <p className="text-muted-foreground mt-1">Direct your AI swarm with natural language commands.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Terminal Area */}
        <Card className="flex-1 bg-black/40 border-white/5 shadow-2xl rounded-2xl overflow-hidden animate-scale-in relative group border-animated">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <CardContent className="h-full flex flex-col p-0">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-muted-foreground font-mono relative z-10">
              <Zap className="w-3 h-3 text-pink-400" />
              <span>TERMINAL — PIXALIFIED_AI_v1.0.4</span>
            </div>

            {/* Terminal Output */}
            <ScrollArea className="flex-1 p-6 font-mono text-sm relative z-10">
              <div className="space-y-6">
                {/* Current Agent Thinking / Response Area */}
                <AnimatePresence mode="wait">
                  {(isProcessing || agentResponse) && (
                    <motion.div 
                      key={agentResponse ? "response" : "thinking"}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="mb-8 p-8 glass-card rounded-3xl relative overflow-hidden group border-primary/20"
                    >
                      {/* Animated Glow Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                              <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                              />
                            </div>
                            <p className="text-sm font-bold gradient-text uppercase tracking-widest">
                              {isProcessing ? "AI Swarm Thinking..." : "Verified Agent Response"}
                            </p>
                          </div>
                          {isProcessing && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <Loader2 className="w-5 h-5 text-primary" />
                            </motion.div>
                          )}
                        </div>
                        
                        <motion.div 
                          className="text-base text-foreground/90 leading-relaxed max-w-none"
                        >
                          {agentResponse ? (
                            <div className="prose prose-invert prose-p:my-2 prose-headings:text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
                              <div className="whitespace-pre-wrap">{agentResponse}</div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4">
                              <motion.div 
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="h-4 bg-white/5 rounded-full w-3/4"
                              />
                              <motion.div 
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                className="h-4 bg-white/5 rounded-full w-1/2"
                              />
                              <motion.div 
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                                className="h-4 bg-white/5 rounded-full w-2/3"
                              />
                            </div>
                          )}
                        </motion.div>

                        {agentResponse && !isProcessing && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-4 pt-6 mt-6 border-t border-white/10"
                          >
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handlePublish('Twitter')}
                              disabled={isPublishing}
                              className="rounded-xl px-6 premium-btn border-none hover:scale-105 transition-all text-white font-semibold"
                            >
                              {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                              Publish Instantly
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePublish('Instagram')}
                              disabled={isPublishing}
                              className="rounded-xl px-6 border-white/10 hover:border-primary/20 hover:bg-white/5 transition-all"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Draft
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Command History / Job Feed */}
                <div className="space-y-4 opacity-70">
                  <div className="flex gap-3 text-white/20 mb-4">
                    <span className="shrink-0">➜</span>
                    <p>System initialized. Waiting for agent directives...</p>
                  </div>

                  {feed.map((job, i) => (
                    <div key={i} className="space-y-4 mb-8">
                      <div className="flex gap-3 text-muted-foreground">
                        <span className="shrink-0 text-pink-400">➜</span>
                        <span className="text-foreground/80">{job.message || job.command}</span>
                      </div>
                      {job.agentResponse && (
                        <div className="ml-6 mt-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                           <div className="flex items-center gap-2 mb-3">
                              <Bot className="w-4 h-4 text-pink-400" />
                              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{job.agentRole?.replace('_', ' ') || "AI agent"} Response</span>
                           </div>
                           <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                              {job.agentResponse}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Terminal Input */}
            <div className="p-4 bg-white/5 border-t border-white/5 relative z-10">
              <form onSubmit={handleCommand} className="flex gap-3 items-center">
                <div className="text-pink-400 font-mono text-lg ml-2">➜</div>
                <Input 
                  placeholder="e.g., Generate a 5-post Instagram strategy for our new coffee brand" 
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base font-mono placeholder:text-muted-foreground/50 h-10"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={isProcessing}
                />
                <Button 
                  type="submit"
                  disabled={isProcessing || !command.trim()}
                  className="bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 gap-2 rounded-xl h-10 px-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                >
                  Execute
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Side Feed */}
        <Card className="w-80 glass-card rounded-2xl border-white/5 animate-slide-in-right overflow-hidden shadow-xl border-animated">
          <CardHeader className="border-b border-white/5 glass py-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#E040FB] to-[#FF6090] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="gradient-text">Activity Feed</span>
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="p-4 space-y-6 stagger-children">
                {loadingFeed ? (
                   <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-xs gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                      Syncing swarm...
                   </div>
                ) : feed.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No recent activity.</div>
                ) : feed.map((job, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer transition-all hover:translate-x-1">
                    <div className="relative">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300",
                        job.status === 'completed' ? "bg-green-500/10 text-green-400" : "bg-pink-500/10 text-pink-400"
                      )}>
                        {job.agentRole === 'trend_scout' ? <TrendingUp className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest truncate">
                        {job.agentRole || "SYSTEM"}
                      </p>
                      <p className="text-[11px] text-foreground/80 leading-snug mt-1 line-clamp-2">
                        {job.message || job.command}
                      </p>
                      <span className="text-[9px] text-muted-foreground/50 font-mono mt-1.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
