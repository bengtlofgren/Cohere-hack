"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, Wifi, Car, Coffee, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VenueSearchToolProps {
  state: "loading" | "success" | "error";
  venues?: any[];
  error?: string;
}

export function VenueSearchTool({ state, venues = [], error }: VenueSearchToolProps) {
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  if (state === "loading") {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">🏢 Searching Venues</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Finding perfect locations for your hackathon...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700 dark:text-blue-300">Analyzing venues by capacity, location, and amenities</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === "error") {
    return (
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Venue Search Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error || "Unable to search venues"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-3 h-3" />;
    if (lower.includes('parking')) return <Car className="w-3 h-3" />;
    if (lower.includes('catering') || lower.includes('food') || lower.includes('kitchen')) return <Coffee className="w-3 h-3" />;
    return null;
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">🏢 Venue Results</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Found {venues.length} perfect venues</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ✓ {venues.length} Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {venues.map((venue, index) => (
          <Card key={venue.id || index} className="border-blue-200 bg-white/50 dark:bg-blue-900/20 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-1">
                    {venue.name}
                  </h4>
                  <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {venue.matchScore}% Match
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 dark:text-blue-200">Up to {venue.capacity} people</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-300 font-medium">{venue.pricing}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {venue.description}
              </p>

              <Collapsible
                open={expandedVenue === venue.id}
                onOpenChange={() => setExpandedVenue(expandedVenue === venue.id ? null : venue.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800">
                    <span>View Amenities</span>
                    {expandedVenue === venue.id ?
                      <ChevronUp className="w-4 h-4 ml-2" /> :
                      <ChevronDown className="w-4 h-4 ml-2" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Available Amenities</h5>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities?.map((amenity: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white dark:bg-blue-800 border-blue-200">
                          <span className="mr-1">{getAmenityIcon(amenity)}</span>
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex justify-end mt-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}