"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { PlanningBoard } from "@/components/planning-board"
import type { HackathonPlan } from "@/types/hackathon"

export default function HackGeniePage() {
  const [hackathonPlan, setHackathonPlan] = useState<HackathonPlan>({
    title: "",
    description: "",
    date: "",
    duration: "",
    venues: [],
    judges: [],
    mentors: [],
    sponsors: [],
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HG</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">HackGenie</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Hackathon Planning</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Plan your hackathon in under 5 minutes</div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Interface - Left 40% */}
        <div className="w-2/5 border-r border-border bg-card">
          <ChatInterface hackathonPlan={hackathonPlan} setHackathonPlan={setHackathonPlan} />
        </div>

        {/* Planning Board - Right 60% */}
        <div className="w-3/5 bg-background">
          <PlanningBoard hackathonPlan={hackathonPlan} />
        </div>
      </div>
    </div>
  )
}
