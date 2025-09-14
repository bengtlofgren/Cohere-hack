import { streamText } from 'ai'
import { cohere } from '@ai-sdk/cohere'
import { rerankVenuesTool, rerankStakeholdersTool, createLumaEventTool } from '@/lib/agent-tools'
import { AGENT_SYSTEM_PROMPT } from '@/lib/agent-prompt'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!process.env.COHERE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Cohere API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = streamText({
      model: cohere('command-r-plus'),
      messages,
      system: AGENT_SYSTEM_PROMPT,
      tools: {
        rerank_venues: rerankVenuesTool,
        rerank_stakeholders: rerankStakeholdersTool,
        create_luma_event: createLumaEventTool,
      },
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Agent API error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ready',
      message: 'HackGenie Agent API is running',
      endpoints: {
        agent: '/api/agent',
        health: '/api/health',
      },
      tools: [
        'rerank_venues',
        'rerank_stakeholders', 
        'create_luma_event',
      ],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}