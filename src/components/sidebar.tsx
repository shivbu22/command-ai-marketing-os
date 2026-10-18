"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Bot, 
  BookOpenText, 
  GitGraph, 
  Database, 
  BarChart3, 
  Settings,
  Zap,
  Instagram,
  Twitter,
  TrendingUp,
  CalendarDays
} from "lucide-react";
import { AgentPresence } from "./global/agent-presence";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Command Console", href: "/console", icon: TerminalSquare },
  { name: "AI Agents", href: "/agents", icon: Bot },
  { name: "Content Studio", href: "/workspace", icon: BookOpenText },
  { name: "Campaigns", href: "/campaigns", icon: GitGraph },
  { name: "Knowledge Base", href: "/knowledge", icon: Database },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 glass border-r border-white/5 z-50 animate-slide-in-left perspective-1000">
      <div className="h-full flex flex-col depth-card overflow-hidden">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E040FB] via-[#FF6090] to-[#FF9100] flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-all duration-500 group-hover:scale-105">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base bg-gradient-to-r from-[#E040FB] via-[#FF6090] to-[#FF9100] bg-clip-text text-transparent">Pixalified AI</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Marketing OS</span>
            </div>
          </Link>
        </div>

        {/* Social Stats Mini Widget */}
        <div className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/10 hover:border-pink-500/30 transition-all duration-500 cursor-default">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="w-3 h-3 text-pink-400" />
            <span>Platform Reach</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1.5">
              <Instagram className="w-3 h-3 text-pink-400" />
              <span className="text-xs font-bold">24.8K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Twitter className="w-3 h-3 text-sky-400" />
              <span className="text-xs font-bold">18.2K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-secondary">+12%</span>
            </div>
          </div>
        </div>

        <AgentPresence />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden animate-slide-up",
                  isActive
                    ? "bg-gradient-to-r from-[#E040FB]/15 to-[#FF6090]/15 text-pink-400 border border-pink-500/20 shadow-lg shadow-pink-500/10"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-all duration-300",
                  isActive ? "text-pink-400" : "group-hover:text-pink-400 group-hover:scale-110"
                )} />
                <span className="flex-1">{item.name}</span>
                {item.name === "Command Console" && (
                  <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity">
                    ⌘K
                  </kbd>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-white/5">
          <div 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
            role="button"
            tabIndex={0}
            aria-label="User Profile Settings"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E040FB] to-[#FF6090] flex items-center justify-center text-white font-bold text-sm ring-2 ring-pink-500/20 group-hover:ring-pink-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/20">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium group-hover:text-pink-400 transition-colors">Pixalified Studio</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-semibold">PRO PLAN</span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
