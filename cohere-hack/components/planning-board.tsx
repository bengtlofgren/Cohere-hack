"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HackathonPlan } from "@/types/hackathon"
import { MapPin, Users, Clock, ExternalLink, Calendar, Target, CheckCircle } from "lucide-react"
import { RecommendationCard } from "@/components/recommendation-card"
import { StatusIndicator } from "@/components/status-indicator"

interface PlanningBoardProps {
  hackathonPlan: HackathonPlan
}

export function PlanningBoard({ hackathonPlan }: PlanningBoardProps) {
  const hasBasicInfo = hackathonPlan.title || hackathonPlan.description
  const hasRecommendations =
    hackathonPlan.venues.length > 0 || hackathonPlan.judges.length > 0 || hackathonPlan.mentors.length > 0
  const isComplete =
    hackathonPlan.venues.length > 0 && hackathonPlan.judges.length > 0 && hackathonPlan.mentors.length > 0

  const handleCreateLumaEvent = () => {
    const eventData = {
      name: hackathonPlan.title || "Tech Innovation Hackathon",
      description: hackathonPlan.description || "An amazing hackathon event",
      venue: hackathonPlan.venues[0]?.name || "TBD",
      duration: hackathonPlan.duration || "48 hours",
    }

    const lumaUrl = `https://lu.ma/create?name=${encodeURIComponent(eventData.name)}&description=${encodeURIComponent(eventData.description)}`
    window.open(lumaUrl, "_blank")
  }

  const getProgress = () => {
    let completed = 0
    const total = 4

    if (hackathonPlan.title) completed++
    if (hackathonPlan.venues.length > 0) completed++
    if (hackathonPlan.judges.length > 0) completed++
    if (hackathonPlan.mentors.length > 0) completed++

    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const progress = getProgress()

  return (
    <div className="h-full overflow-y-auto">
      {/* Event Header */}
      <div className="p-6 border-b border-border bg-card">
        {hasBasicInfo ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground text-balance">{hackathonPlan.title}</h2>
                {hackathonPlan.description && (
                  <p className="text-muted-foreground mt-2 text-pretty">{hackathonPlan.description}</p>
                )}
              </div>
              <div className="ml-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{progress.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              {hackathonPlan.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {hackathonPlan.date}
                </div>
              )}
              {hackathonPlan.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {hackathonPlan.duration}
                </div>
              )}
              {hackathonPlan.venues.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Up to {Math.max(...hackathonPlan.venues.map((v) => v.capacity))} participants
                </div>
              )}
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Plan Your Hackathon?</h2>
            <p className="text-muted-foreground">Start chatting with HackGenie to begin planning your event</p>
          </div>
        )}
      </div>

      {/* Planning Sections */}
      <div className="p-6 space-y-6">
        {/* Venues Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Venues</h3>
            {hackathonPlan.venues.length > 0 ? (
              <StatusIndicator status="completed" label={`${hackathonPlan.venues.length} found`} />
            ) : (
              <StatusIndicator status="pending" label="Pending" />
            )}
          </div>

          {hackathonPlan.venues.length > 0 ? (
            <div className="grid gap-4">
              {hackathonPlan.venues.map((venue) => (
                <RecommendationCard
                  key={venue.id}
                  title={venue.name}
                  subtitle={venue.location}
                  description={venue.description}
                  matchScore={venue.matchScore}
                  confidence={venue.confidence}
                  details={[
                    `Capacity: ${venue.capacity} people`,
                    `Pricing: ${venue.pricing}`,
                    `Amenities: ${venue.amenities.slice(0, 3).join(", ")}${venue.amenities.length > 3 ? "..." : ""}`,
                  ]}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">No venues recommended yet</CardContent>
            </Card>
          )}
        </div>

        {/* Judges Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Judges</h3>
            {hackathonPlan.judges.length > 0 ? (
              <StatusIndicator status="completed" label={`${hackathonPlan.judges.length} found`} />
            ) : (
              <StatusIndicator status="pending" label="Pending" />
            )}
          </div>

          {hackathonPlan.judges.length > 0 ? (
            <div className="grid gap-4">
              {hackathonPlan.judges.map((judge) => (
                <RecommendationCard
                  key={judge.id}
                  title={judge.name}
                  subtitle={judge.company}
                  description={judge.bio}
                  matchScore={judge.matchScore}
                  confidence={judge.confidence}
                  details={[
                    `Expertise: ${judge.expertise.slice(0, 2).join(", ")}${judge.expertise.length > 2 ? "..." : ""}`,
                  ]}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">No judges recommended yet</CardContent>
            </Card>
          )}
        </div>

        {/* Mentors Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Mentors</h3>
            {hackathonPlan.mentors.length > 0 ? (
              <StatusIndicator status="completed" label={`${hackathonPlan.mentors.length} found`} />
            ) : (
              <StatusIndicator status="pending" label="Pending" />
            )}
          </div>

          {hackathonPlan.mentors.length > 0 ? (
            <div className="grid gap-4">
              {hackathonPlan.mentors.map((mentor) => (
                <RecommendationCard
                  key={mentor.id}
                  title={mentor.name}
                  subtitle={mentor.company}
                  description={mentor.bio}
                  matchScore={mentor.matchScore}
                  confidence={mentor.confidence}
                  details={[
                    `Expertise: ${mentor.expertise.slice(0, 2).join(", ")}${mentor.expertise.length > 2 ? "..." : ""}`,
                  ]}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">No mentors recommended yet</CardContent>
            </Card>
          )}
        </div>

        {isComplete && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 dark:from-green-950 dark:to-blue-950 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your hackathon plan is ready!</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                All key components have been planned with {hackathonPlan.venues.length} venues,{" "}
                {hackathonPlan.judges.length} judges, and {hackathonPlan.mentors.length} mentors.
              </p>
              <Button onClick={handleCreateLumaEvent} className="bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Luma Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
