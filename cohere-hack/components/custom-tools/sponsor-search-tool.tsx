"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building, Target, Users, ChevronDown, ChevronUp, ExternalLink, Mail, Globe } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SponsorSearchToolProps {
  state: "loading" | "success" | "error";
  sponsors?: any[];
  error?: string;
}

export function SponsorSearchTool({ state, sponsors = [], error }: SponsorSearchToolProps) {
  const [expandedSponsor, setExpandedSponsor] = useState<string | null>(null);

  if (state === "loading") {
    return (
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">💰 Finding Sponsors</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Discovering potential sponsors for your hackathon...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">Matching theme alignment and sponsorship budget</span>
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
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Sponsor Search Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error || "Unable to search for sponsors"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getSponsorTier = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return { color: 'bg-gray-800 border-gray-600', text: 'Platinum', textColor: 'text-gray-100' };
      case 'gold': return { color: 'bg-yellow-500 border-yellow-400', text: 'Gold', textColor: 'text-white' };
      case 'silver': return { color: 'bg-gray-400 border-gray-300', text: 'Silver', textColor: 'text-white' };
      case 'bronze': return { color: 'bg-orange-600 border-orange-500', text: 'Bronze', textColor: 'text-white' };
      default: return { color: 'bg-blue-600 border-blue-500', text: 'Partner', textColor: 'text-white' };
    }
  };

  const getIndustryIcon = (industry: string) => {
    const lower = industry.toLowerCase();
    if (lower.includes('tech') || lower.includes('software')) return <Target className="w-3 h-3" />;
    if (lower.includes('finance') || lower.includes('fintech')) return <DollarSign className="w-3 h-3" />;
    if (lower.includes('startup') || lower.includes('enterprise')) return <Building className="w-3 h-3" />;
    return <Building className="w-3 h-3" />;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">💰 Potential Sponsors</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Found {sponsors.length} interested sponsors</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ✓ {sponsors.length} Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sponsors.map((sponsor, index) => {
          const tierInfo = getSponsorTier(sponsor.tier);

          return (
            <Card key={sponsor.id || index} className="border-yellow-200 bg-white/50 dark:bg-yellow-900/20 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                        {sponsor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-yellow-900 dark:text-yellow-100">
                          {sponsor.name}
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                          {sponsor.industry}
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          {sponsor.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      {sponsor.matchScore}% Match
                    </Badge>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${tierInfo.color} ${tierInfo.textColor}`}>
                      {tierInfo.text} Sponsor
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      {formatCurrency(sponsor.sponsorshipAmount)} budget
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-700 dark:text-yellow-300">
                      {sponsor.eventsSponsored} events sponsored
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {sponsor.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {sponsor.interests?.slice(0, 3).map((interest: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-200">
                      <span className="mr-1">{getIndustryIcon(interest)}</span>
                      {interest}
                    </Badge>
                  ))}
                  {sponsor.interests?.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      +{sponsor.interests.length - 3} more
                    </Badge>
                  )}
                </div>

                <Collapsible
                  open={expandedSponsor === sponsor.id}
                  onOpenChange={() => setExpandedSponsor(expandedSponsor === sponsor.id ? null : sponsor.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-800">
                      <span>View Sponsorship Details</span>
                      {expandedSponsor === sponsor.id ?
                        <ChevronUp className="w-4 h-4 ml-2" /> :
                        <ChevronDown className="w-4 h-4 ml-2" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg space-y-3">
                      <div>
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Sponsorship Benefits</h5>
                        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                          {sponsor.benefits?.map((benefit: string, i: number) => (
                            <li key={i}>• {benefit}</li>
                          )) || [
                            "• Logo placement on event materials",
                            "• Speaking opportunity at opening ceremony",
                            "• Access to participant resume database",
                            "• Networking session with top teams"
                          ].map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Contact Information</h5>
                        <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-300">
                          <p><span className="font-medium">Contact:</span> {sponsor.contactPerson || "Partnership Team"}</p>
                          <p><span className="font-medium">Email:</span> {sponsor.email || "partnerships@company.com"}</p>
                          <p><span className="font-medium">Response Time:</span> {sponsor.responseTime || "3-5 business days"}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                        {sponsor.website && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex justify-end mt-3">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Contact Sponsor
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}