"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Key, Plug, CreditCard, Bell, Eye, EyeOff, Loader2, Save, CheckCircle2, Instagram, Twitter, Linkedin, Pin, Share2, Plus } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<{ name?: string; email?: string; settings?: { openaiKey?: string } } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("AI API Keys")

  const [formData, setFormData] = useState({
    name: "",
    openaiKey: "",
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/user/settings")
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setFormData({
            name: data.name || "",
            openaiKey: data.settings?.openaiKey === "****" ? "" : (data.settings?.openaiKey || ""),
          })
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          settings: {
            openaiKey: formData.openaiKey || undefined
          }
        }),
      })

      if (res.ok) {
        setSaveStatus("Success")
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveStatus("Error")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      {/* Settings Navigation */}
      <div className="w-full md:w-56 shrink-0 space-y-1 animate-slide-in-left">
        <h2 className="font-semibold px-3 mb-4 text-lg gradient-text">Settings</h2>
        {[
          { icon: User, label: "Profile" },
          { icon: Key, label: "AI API Keys" },
          { icon: Plug, label: "Integrations" },
          { icon: Share2, label: "Workspaces" },
          { icon: CreditCard, label: "Billing" },
          { icon: Bell, label: "Notifications" },
        ].map((item, i) => (
          <Button 
            key={i} 
            variant="ghost" 
            onClick={() => setActiveTab(item.label)}
            className={`w-full justify-start rounded-xl transition-all duration-300 ${activeTab === item.label ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10' : 'hover:bg-white/5 hover:translate-x-1'}`}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 space-y-8 max-w-3xl">
        <div className="animate-slide-up flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text mb-1">{activeTab}</h1>
            <p className="text-muted-foreground">Manage your Pixalified AI workspace preferences.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-xl bg-gradient-to-r from-primary to-rose-500 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saveStatus === "Success" ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saveStatus === "Success" ? "Saved!" : "Save Changes"}
          </Button>
        </div>

        {activeTab === "Profile" && (
          <Card className="glass-card rounded-2xl overflow-hidden animate-slide-up">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>How you appear in the workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-background/50 border-white/10 rounded-xl" 
                />
              </div>
              <div className="space-y-2 text-muted-foreground">
                <Label>Email</Label>
                <p className="text-sm px-1">{user?.email}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "AI API Keys" && (
          <Card className="glass-card rounded-2xl overflow-hidden animate-slide-up">
            <CardHeader>
              <CardTitle>Language Models</CardTitle>
              <CardDescription>Connect your own API keys to power the agents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>OpenAI API Key (Override)</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder={user?.settings?.openaiKey === "****" ? "Key is set (masked)" : "sk-..."}
                    value={formData.openaiKey}
                    onChange={(e) => setFormData({...formData, openaiKey: e.target.value})}
                    className="pr-10 bg-background/50 border-white/10 rounded-xl" 
                  />
                  <Key className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Used for content creation and image generation (DALL-E 3).</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "Workspaces" && (
          <div className="space-y-6 animate-slide-up">
            <Card className="glass-card rounded-2xl overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle>Organization Architecture</CardTitle>
                <CardDescription>Manage collaborative nodes and team access controls.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {[
                    { name: "Pixalified HQ", role: "Owner", members: 12, status: "Active" },
                    { name: "Global Marketing Swarm", role: "Admin", members: 8, status: "Active" },
                    { name: "Client: Stark Industries", role: "Manager", members: 4, status: "Standby" },
                  ].map((ws, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {ws.name[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{ws.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{ws.members} active intelligence nodes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-[10px] border-white/10 uppercase tracking-widest">{ws.role}</Badge>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">Switch</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full premium-button rounded-xl py-6 flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
               Construct New Workspace
            </Button>
          </div>
        )}

        {activeTab === "Integrations" && (
          <div className="space-y-6 animate-slide-up">
            <Card className="glass-card rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle>Global Connections</CardTitle>
                <CardDescription>Authorize Pixalified AI to synchronize with your social ecosystems.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "LinkedIn", icon: Linkedin, color: "text-blue-500", desc: "Professional networking & thought leadership", connected: true },
                  { name: "Twitter / X", icon: Twitter, color: "text-sky-400", desc: "Real-time updates & community engagement", connected: false },
                  { name: "Instagram", icon: Instagram, color: "text-pink-500", desc: "Visual storytelling & brand awareness", connected: false },
                  { name: "Pinterest", icon: Pin, color: "text-red-500", desc: "Creative inspiration & traffic generation", connected: false },
                ].map((platform, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center ${platform.color} border border-white/5 shadow-inner`}>
                        <platform.icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{platform.name}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{platform.desc}</span>
                      </div>
                    </div>
                    {platform.connected ? (
                      <Badge className="bg-green-500/20 text-green-400 border-none px-2 py-0.5 text-[10px]">Connected</Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-lg border-white/10 hover:bg-white/5">Connect</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl overflow-hidden border-dashed border-white/10 opacity-50">
              <CardHeader>
                <CardTitle className="text-sm">Developer Webhooks</CardTitle>
              </CardHeader>
              <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                <Share2 className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-xs">Advanced webhook orchestration coming soon.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "Notifications" && (
           <Card className="glass-card rounded-2xl overflow-hidden animate-slide-up">
           <CardHeader>
             <CardTitle>{activeTab}</CardTitle>
             <CardDescription>Customize your Swarm intelligence alerts.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              {[
                "New campaign strategy generated",
                "ROI target achieved",
                "High engagement detected",
                "Swarm job completion report"
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <span className="text-sm">{notif}</span>
                  <Switch defaultChecked />
                </div>
              ))}
           </CardContent>
         </Card>
        )}

        {activeTab === "Billing" && (
          <Card className="glass-card rounded-2xl overflow-hidden glow-primary animate-slide-up relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-rose-500 opacity-80" />
            <CardHeader>
              <CardTitle className="flex justify-between w-full text-lg">
                <span>Credit Usage</span>
                <span className="text-secondary font-mono text-sm bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">Active Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-rose-500 to-orange-500" style={{ width: '45%' }} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">4,500 / 10,000 credits</span>
                <Button size="sm" className="bg-gradient-to-r from-primary to-rose-500 text-white rounded-xl shadow-lg">Manage Plan</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
