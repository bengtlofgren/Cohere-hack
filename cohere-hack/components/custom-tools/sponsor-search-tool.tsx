"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Target, Mail } from "lucide-react";
import { toast } from "sonner";

interface Sponsor {
  id?: string;
  name: string;
  industry: string;
  location: string;
  matchScore?: number;
  tier: string;
  sponsorshipAmount: number;
  eventsSponsored: number;
  description: string;
  interests?: string[];
  benefits?: string[];
  contactPerson?: string;
  email?: string;
  responseTime?: string;
  website?: string;
}

interface SponsorSearchToolProps {
  state: "loading" | "success" | "error";
  sponsors?: Sponsor[];
  error?: string;
}

export function SponsorSearchTool({
  state,
  sponsors = [],
  error,
}: SponsorSearchToolProps) {
  if (state === "loading") {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Finding Sponsors
              </h3>
              <p className="text-sm text-muted-foreground">
                Searching for sponsors...
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">Loading sponsors...</p>
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
              <DollarSign className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive">
                Sponsor Search Failed
              </h3>
              <p className="text-sm text-muted-foreground">
                {error || "Unable to search for sponsors"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "gold":
        return "bg-chart-1 text-primary-foreground";
      case "silver":
        return "bg-chart-2 text-primary-foreground";
      case "bronze":
        return "bg-chart-3 text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Potential Sponsors
              </h3>
              <p className="text-sm text-muted-foreground">
                Found {sponsors.length} interested sponsors
              </p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground border-border">
            {sponsors.length} Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sponsors.map((sponsor, index) => (
          <Card key={sponsor.id || index} className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {sponsor.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {sponsor.name}
                      </h4>
                      <p className="text-sm text-foreground">
                        {sponsor.industry}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sponsor.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className="border-border text-foreground"
                  >
                    {sponsor.matchScore || 85}% Match
                  </Badge>
                  <Badge className={getTierColor(sponsor.tier)}>
                    {sponsor.tier}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-chart-1" />
                  <span className="text-foreground">
                    ${sponsor.sponsorshipAmount?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    {sponsor.eventsSponsored} events sponsored
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {sponsor.description}
              </p>

              {sponsor.interests && sponsor.interests.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Interests:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sponsor.interests
                      .slice(0, 4)
                      .map((interest: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs bg-accent/50 text-foreground border-border"
                        >
                          {interest}
                        </Badge>
                      ))}
                    {sponsor.interests.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-muted text-muted-foreground border-border"
                      >
                        +{sponsor.interests.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {sponsor.contactPerson && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Contact:</span>{" "}
                    {sponsor.contactPerson}
                    {sponsor.responseTime && (
                      <span> • Response time: {sponsor.responseTime}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Email sent to ${sponsor.contactPerson} at ${sponsor.name}`)}
                    className="ml-2"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

