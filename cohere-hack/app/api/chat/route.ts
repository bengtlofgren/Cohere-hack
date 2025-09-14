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
        inputSchema: z.object({
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
        inputSchema: z.object({
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
        inputSchema: z.object({
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
        inputSchema: z.object({
          theme: z.string().optional().describe("Hackathon theme"),
          budget: z.number().optional().describe("Target budget amount"),
        }),
        execute: async ({ theme, budget }) => {
          const result = await searchSponsors({ theme, budget });
          return result;
        },
      }),
    },
    system: `You are HackGenie, an AI assistant specialized in planning hackathons in London and the UK. You help users organize successful hackathon events by:

1. Understanding their vision and requirements
2. Finding suitable London-based venues with pricing in GBP
3. Recruiting expert judges from the UK tech industry
4. Connecting with experienced UK-based mentors
5. Identifying potential British sponsors and tech companies
6. Providing comprehensive event planning guidance tailored to the UK market

You are particularly knowledgeable about London's vibrant tech ecosystem, including innovation hubs in Shoreditch, Canary Wharf, King's Cross, and other key areas. You understand the UK fintech, AI, and startup scenes, and can recommend partnerships with institutions like Imperial College London, UCL, and other universities.

You are enthusiastic, knowledgeable, and focused on creating amazing hackathon experiences in the UK. Always use the available tools to provide specific, actionable recommendations that are relevant to the London tech scene.

When users describe their hackathon idea, immediately start helping them by using the appropriate search tools to find London venues, UK judges, British mentors, and local sponsors that match their needs. Ask as many questions as you need and always ask them if they need any other services based on the chat context.`,
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
