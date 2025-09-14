import { cohere } from "@ai-sdk/cohere";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import {
  searchVenues,
  searchJudges,
  searchMentors,
  searchSponsors,
} from "@/lib/agent-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model = "command-r-plus" } = await req.json();

  const result = streamText({
    model: cohere(model),
    messages: convertToModelMessages(messages),
    tools: {
      searchVenues: tool({
        description:
          "Search for hackathon venues based on capacity, theme, and location",
        parameters: z.object({
          capacity: z.number().optional().describe("Number of participants"),
          theme: z
            .string()
            .optional()
            .describe("Hackathon theme (ai, climate, fintech, etc.)"),
          location: z.string().optional().describe("Preferred location type"),
        }),
        execute: async ({ capacity, theme, location }) => {
          const result = await searchVenues({ capacity, theme, location });
          return result;
        },
      }),
      searchJudges: tool({
        description: "Find expert judges for the hackathon",
        parameters: z.object({
          expertise: z
            .array(z.string())
            .optional()
            .describe("Required expertise areas"),
          theme: z.string().optional().describe("Hackathon theme"),
        }),
        execute: async ({ expertise, theme }) => {
          const result = await searchJudges({ expertise, theme });
          return result;
        },
      }),
      searchMentors: tool({
        description: "Find experienced mentors for participants",
        parameters: z.object({
          expertise: z
            .array(z.string())
            .optional()
            .describe("Required expertise areas"),
          skills: z
            .array(z.string())
            .optional()
            .describe("Technical skills needed"),
          theme: z.string().optional().describe("Hackathon theme"),
        }),
        execute: async ({ expertise, skills, theme }) => {
          const result = await searchMentors({ expertise, skills, theme });
          return result;
        },
      }),
      searchSponsors: tool({
        description: "Find potential sponsors for the hackathon",
        parameters: z.object({
          theme: z.string().optional().describe("Hackathon theme"),
          budget: z.number().optional().describe("Target budget amount"),
        }),
        execute: async ({ theme, budget }) => {
          const result = await searchSponsors({ theme, budget });
          return result;
        },
      }),
    },
    system: `You are HackGenie, an AI assistant specialized in planning hackathons. You help users organize successful hackathon events by:

1. Understanding their vision and requirements
2. Finding suitable venues based on capacity and theme
3. Recruiting expert judges with relevant expertise
4. Connecting with experienced mentors
5. Identifying potential sponsors
6. Providing comprehensive event planning guidance

You are enthusiastic, knowledgeable, and focused on creating amazing hackathon experiences. Always use the available tools to provide specific, actionable recommendations.

When users describe their hackathon idea, immediately start helping them by using the appropriate search tools to find venues, judges, mentors, and sponsors that match their needs.`,
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
