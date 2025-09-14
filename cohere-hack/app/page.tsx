"use client";

import { ChatInterface } from "@/components/chat-interface";
import { Sparkles, Clock, Users } from "lucide-react";

export default function HackGeniePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Enhanced Header with Glassmorphism Effect */}
      <header className="relative backdrop-blur-lg bg-white/70 dark:bg-slate-950/70 border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-blue-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
        <div className="relative flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-lg">HG</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                HackGenie
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  AI-Powered Hackathon Planning
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Plan in under 5 minutes
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>1,247 hackathons planned</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <div className="h-[calc(100vh-88px)] p-6">
        <div className="h-full max-w-7xl mx-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
