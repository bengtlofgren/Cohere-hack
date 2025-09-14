"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Briefcase } from "lucide-react";

interface Judge {
  id?: string;
  name: string;
  title: string;
  company: string;
  matchScore: number;
  rating: number;
  experience: number;
  judgedEvents: number;
  bio: string;
  expertise?: string[];
  achievements?: string[];
  linkedin?: string;
  twitter?: string;
}

interface JudgeSearchToolProps {
  state: "loading" | "success" | "error";
  judges?: Judge[];
  error?: string;
}

export function JudgeSearchTool({ state, judges = [], error }: JudgeSearchToolProps) {
  if (state === "loading") {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Finding Expert Judges</h3>
              <p className="text-sm text-muted-foreground">Searching for industry experts...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">Loading judges...</p>
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
              <Trophy className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive">Judge Search Failed</h3>
              <p className="text-sm text-muted-foreground">{error || "Unable to search for judges"}</p>
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
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Expert Judges</h3>
              <p className="text-sm text-muted-foreground">Found {judges.length} qualified judges</p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground border-border">{judges.length} Found</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {judges.map((judge, index) => (
          <Card key={judge.id || index} className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {judge.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{judge.name}</h4>
                      <p className="text-sm text-foreground">{judge.title}</p>
                      <p className="text-xs text-muted-foreground">{judge.company}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="border-border text-foreground">{judge.matchScore}% Match</Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < judge.rating
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
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{judge.experience} years exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-chart-1" />
                  <span className="text-foreground">{judge.judgedEvents} events</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{judge.bio}</p>

              {judge.expertise && judge.expertise.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {judge.expertise.slice(0, 4).map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-accent/50 text-foreground border-border">
                        {skill}
                      </Badge>
                    ))}
                    {judge.expertise.length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                        +{judge.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}