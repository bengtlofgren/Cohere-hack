"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Code } from "lucide-react";

interface Mentor {
  id?: string;
  name: string;
  title: string;
  company: string;
  matchScore?: number;
  rating: number;
  studentsHelped: number;
  bio: string;
  level?: string;
  skills?: string[];
  mentoringStyle?: string;
  availability?: string;
  github?: string;
}

interface MentorSearchToolProps {
  state: "loading" | "success" | "error";
  mentors?: Mentor[];
  error?: string;
}

export function MentorSearchTool({ state, mentors = [], error }: MentorSearchToolProps) {
  if (state === "loading") {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Finding Experienced Mentors</h3>
              <p className="text-sm text-muted-foreground">Searching for mentors...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">Loading mentors...</p>
        </CardContent>
      </Card>
    );
  }

  if (state === "error") {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive">Mentor Search Failed</h3>
              <p className="text-sm text-muted-foreground">{error || "Unable to search for mentors"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Expert Mentors</h3>
              <p className="text-sm text-muted-foreground">Found {mentors.length} experienced mentors</p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground border-border">{mentors.length} Found</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentors.map((mentor, index) => (
          <Card key={mentor.id || index} className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {mentor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                      <p className="text-sm text-foreground">{mentor.title}</p>
                      <p className="text-xs text-muted-foreground">{mentor.company}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="border-border text-foreground">{mentor.matchScore || 85}% Match</Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < mentor.rating
                            ? "text-chart-1 fill-chart-1"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{mentor.studentsHelped} students helped</span>
                </div>
                {mentor.level && (
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-chart-2" />
                    <span className="text-foreground">{mentor.level} level</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3">{mentor.bio}</p>

              {mentor.skills && mentor.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 4).map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-accent/50 text-foreground border-border">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                        +{mentor.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {mentor.availability && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Availability:</span> {mentor.availability}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}