"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Briefcase, GraduationCap, ChevronDown, ChevronUp, ExternalLink, Linkedin, Twitter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface JudgeSearchToolProps {
  state: "loading" | "success" | "error";
  judges?: any[];
  error?: string;
}

export function JudgeSearchTool({ state, judges = [], error }: JudgeSearchToolProps) {
  const [expandedJudge, setExpandedJudge] = useState<string | null>(null);

  if (state === "loading") {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">🏆 Finding Expert Judges</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Searching for industry experts and thought leaders...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-purple-700 dark:text-purple-300">Matching expertise areas and experience levels</span>
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
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Judge Search Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error || "Unable to search for judges"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getExpertiseIcon = (expertise: string) => {
    const lower = expertise.toLowerCase();
    if (lower.includes('cto') || lower.includes('vp') || lower.includes('director')) return <Briefcase className="w-3 h-3" />;
    if (lower.includes('professor') || lower.includes('phd') || lower.includes('research')) return <GraduationCap className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">🏆 Expert Judges</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Found {judges.length} qualified judges</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ✓ {judges.length} Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {judges.map((judge, index) => (
          <Card key={judge.id || index} className="border-purple-200 bg-white/50 dark:bg-purple-900/20 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {judge.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-purple-900 dark:text-purple-100">
                        {judge.name}
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                        {judge.title}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        {judge.company}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                    {judge.matchScore}% Match
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < judge.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-800 dark:text-purple-200">{judge.experience} years exp</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">{judge.judgedEvents} events</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {judge.bio}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {judge.expertise?.slice(0, 3).map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-200">
                    {skill}
                  </Badge>
                ))}
                {judge.expertise?.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    +{judge.expertise.length - 3} more
                  </Badge>
                )}
              </div>

              <Collapsible
                open={expandedJudge === judge.id}
                onOpenChange={() => setExpandedJudge(expandedJudge === judge.id ? null : judge.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800">
                    <span>View Full Profile</span>
                    {expandedJudge === judge.id ?
                      <ChevronUp className="w-4 h-4 ml-2" /> :
                      <ChevronDown className="w-4 h-4 ml-2" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg space-y-3">
                    <div>
                      <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">All Expertise Areas</h5>
                      <div className="flex flex-wrap gap-2">
                        {judge.expertise?.map((skill: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-white dark:bg-purple-800 border-purple-200">
                            <span className="mr-1">{getExpertiseIcon(skill)}</span>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {judge.achievements && (
                      <div>
                        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Key Achievements</h5>
                        <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                          {judge.achievements.map((achievement: string, i: number) => (
                            <li key={i}>• {achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {judge.linkedin && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Linkedin className="w-3 h-3 mr-1" />
                          LinkedIn
                        </Button>
                      )}
                      {judge.twitter && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Twitter className="w-3 h-3 mr-1" />
                          Twitter
                        </Button>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex justify-end mt-3">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Contact Judge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}