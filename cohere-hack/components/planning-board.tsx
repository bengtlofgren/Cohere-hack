"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, MapPin, Users, Trophy, DollarSign, ArrowLeft } from "lucide-react";

export function PlanningBoard() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            AI-Powered Hackathon Planning
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Chat with HackGenie to plan your hackathon. I'll help you find venues, judges, mentors, and sponsors using AI-powered search tools.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Venue Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Find perfect venues based on capacity, location, and theme requirements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Expert Judges</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with industry experts and thought leaders to judge your hackathon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Experienced Mentors</h3>
                  <p className="text-sm text-muted-foreground">
                    Find skilled mentors to guide participants through the hackathon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Sponsor Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover sponsors aligned with your hackathon theme and budget
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Get Started
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Start chatting with HackGenie on the left. Try one of the quick start options or describe your hackathon idea.
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Tell me about your theme and target audience</li>
                  <li>• Specify your location and capacity requirements</li>
                  <li>• I'll use AI tools to find everything you need</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}