"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-scale-in">
          <div className="glass-card p-12 rounded-3xl border-white/5 max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-primary/5 pointer-events-none" />
            
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Neural Link Interrupted</h1>
            <p className="text-muted-foreground text-sm mb-8">
              A critical synchronization error occurred in the Swarm Intelligence engine. Don&apos;t worry, your data is safe.
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => this.setState({ hasError: false })}
                className="premium-button rounded-xl w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Synchronization
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="rounded-xl w-full border-white/10 hover:bg-white/5 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return to Command Deck
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
