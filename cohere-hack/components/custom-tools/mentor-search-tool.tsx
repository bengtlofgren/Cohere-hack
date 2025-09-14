"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Code, Lightbulb, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Github } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MentorSearchToolProps {
  state: "loading" | "success" | "error";
  mentors?: any[];
  error?: string;
}

export function MentorSearchTool({ state, mentors = [], error }: MentorSearchToolProps) {
  const [expandedMentor, setExpandedMentor] = useState<string | null>(null);

  if (state === "loading") {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">👥 Finding Experienced Mentors</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Searching for skilled mentors to guide participants...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-green-700 dark:text-green-300">Matching technical skills and mentoring experience</span>
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
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Mentor Search Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error || "Unable to search for mentors"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getSkillIcon = (skill: string) => {
    const lower = skill.toLowerCase();
    if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('frontend')) return <Code className="w-3 h-3" />;
    if (lower.includes('python') || lower.includes('java') || lower.includes('backend') || lower.includes('api')) return <Code className="w-3 h-3" />;
    if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) return <Lightbulb className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  const getMentorshipLevel = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'senior': return { color: 'bg-green-600', text: 'Senior' };
      case 'expert': return { color: 'bg-blue-600', text: 'Expert' };
      case 'lead': return { color: 'bg-purple-600', text: 'Lead' };
      default: return { color: 'bg-gray-600', text: 'Mentor' };
    }
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">👥 Experienced Mentors</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Found {mentors.length} skilled mentors</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ✓ {mentors.length} Found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentors.map((mentor, index) => {
          const levelInfo = getMentorshipLevel(mentor.level);

          return (
            <Card key={mentor.id || index} className="border-green-200 bg-white/50 dark:bg-green-900/20 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
                        {mentor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-green-900 dark:text-green-100">
                          {mentor.name}
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          {mentor.title}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {mentor.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {mentor.matchScore}% Match
                    </Badge>
                    <div className={`px-2 py-1 rounded text-xs text-white font-medium ${levelInfo.color}`}>
                      {levelInfo.text} Mentor
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 dark:text-green-200">{mentor.studentsHelped} students helped</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-700 dark:text-yellow-300 font-medium">{mentor.rating}/5 rating</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.skills?.slice(0, 4).map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-200">
                      <span className="mr-1">{getSkillIcon(skill)}</span>
                      {skill}
                    </Badge>
                  ))}
                  {mentor.skills?.length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      +{mentor.skills.length - 4} more
                    </Badge>
                  )}
                </div>

                <Collapsible
                  open={expandedMentor === mentor.id}
                  onOpenChange={() => setExpandedMentor(expandedMentor === mentor.id ? null : mentor.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-green-700 hover:bg-green-100 dark:hover:bg-green-800">
                      <span>View Mentoring Details</span>
                      {expandedMentor === mentor.id ?
                        <ChevronUp className="w-4 h-4 ml-2" /> :
                        <ChevronDown className="w-4 h-4 ml-2" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg space-y-3">
                      <div>
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Technical Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills?.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-white dark:bg-green-800 border-green-200">
                              <span className="mr-1">{getSkillIcon(skill)}</span>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Mentoring Style</h5>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {mentor.mentoringStyle || "Supportive and hands-on approach, focusing on practical learning and skill development"}
                        </p>
                      </div>

                      {mentor.availability && (
                        <div>
                          <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Availability</h5>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            {mentor.availability}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {mentor.github && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <Github className="w-3 h-3 mr-1" />
                            GitHub
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex justify-end mt-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Contact Mentor
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