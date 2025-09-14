export interface Venue {
  id: string
  name: string
  location: string
  capacity: number
  pricing: string
  description: string
  amenities: string[]
  matchScore?: number
}

export interface Stakeholder {
  id: string
  name: string
  role: "judge" | "mentor"
  expertise: string[]
  company: string
  bio: string
  matchScore?: number
  avatar?: string
}

export interface Sponsor {
  id: string
  name: string
  tier: "title" | "gold" | "silver" | "bronze"
  contribution: string
  requirements: string[]
  matchScore?: number
  logo?: string
}

export interface HackathonPlan {
  title: string
  description: string
  date: string
  duration: string
  venues: Venue[]
  judges: Stakeholder[]
  mentors: Stakeholder[]
  sponsors: Sponsor[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  name: string
  status: "pending" | "completed" | "error"
  result?: any
}
