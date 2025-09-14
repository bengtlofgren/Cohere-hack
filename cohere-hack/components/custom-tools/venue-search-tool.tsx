"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign } from "lucide-react";

interface Venue {
  id?: string;
  name: string;
  location: string;
  capacity: number;
  matchScore: number;
  description: string;
  pricing: string;
  amenities?: string[];
}

interface VenueSearchToolProps {
  state: "loading" | "success" | "error";
  venues?: Venue[];
  error?: string;
}

export function VenueSearchTool({ state, venues = [], error }: VenueSearchToolProps) {
  if (state === "loading") {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Searching Venues</h3>
              <p className="text-sm text-muted-foreground">Finding venues...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">Loading venues...</p>
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
              <MapPin className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive">Venue Search Failed</h3>
              <p className="text-sm text-muted-foreground">{error || "Unable to search venues"}</p>
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
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Venue Results</h3>
              <p className="text-sm text-muted-foreground">Found {venues.length} venues</p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground border-border">{venues.length} Found</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {venues.map((venue, index) => (
          <Card key={venue.id || index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{venue.name}</h4>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className="border-border text-foreground">{venue.matchScore}% Match</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Up to {venue.capacity} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-chart-2" />
                  <span className="text-foreground">{venue.pricing}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{venue.description}</p>

              {venue.amenities && venue.amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities.map((amenity: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
                        {amenity}
                      </Badge>
                    ))}
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