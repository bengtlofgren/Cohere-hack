import venuesData from "@/data/venues.json"
import judgesData from "@/data/judges.json"
import mentorsData from "@/data/mentors.json"
import sponsorsData from "@/data/sponsors.json"
import { Venue, Stakeholder, Sponsor } from "@/types/hackathon"

const sampleVenues: Venue[] = venuesData
const sampleJudges: Stakeholder[] = judgesData
const sampleMentors: Stakeholder[] = mentorsData
const sampleSponsors: Sponsor[] = sponsorsData

export interface ToolResult {
  success: boolean
  data?: any
  error?: string
}

export async function searchVenues(criteria: {
  capacity?: number
  location?: string
  budget?: number
  theme?: string
}): Promise<ToolResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    let filteredVenues = [...sampleVenues]

    // Filter by capacity
    if (criteria.capacity) {
      filteredVenues = filteredVenues.filter((venue) => venue.capacity >= criteria.capacity! * 0.8)
    }

    // Filter by location preference
    if (criteria.location) {
      const locationKeywords = criteria.location.toLowerCase().split(" ")
      filteredVenues = filteredVenues.filter((venue) =>
        locationKeywords.some((keyword) => venue.location.toLowerCase().includes(keyword)),
      )
    }

    // Adjust match scores based on theme
    if (criteria.theme) {
      const theme = criteria.theme.toLowerCase()
      filteredVenues = filteredVenues.map((venue) => {
        let adjustedScore = venue.matchScore

        if (theme.includes("climate") || theme.includes("sustainability")) {
          if (venue.name.includes("UCSF") || venue.name.includes("Stanford")) {
            adjustedScore += 5
          }
        }

        if (theme.includes("ai") || theme.includes("ml") || theme.includes("tech")) {
          if (venue.name.includes("Google") || venue.name.includes("Microsoft")) {
            adjustedScore += 5
          }
        }

        if (theme.includes("fintech") || theme.includes("finance")) {
          if (venue.name.includes("Salesforce") || venue.name.includes("Battery")) {
            adjustedScore += 5
          }
        }

        return { ...venue, matchScore: Math.min(adjustedScore, 100) }
      })
    }

    // Use Cohere rerank for better relevance
    const query = `hackathon venue ${criteria.theme || ''} ${criteria.location || ''} capacity ${criteria.capacity || ''}`
    const rankedVenues = await rerankResults(query.trim(), filteredVenues)
    const topVenues = rankedVenues.slice(0, Math.min(5, filteredVenues.length))

    return {
      success: true,
      data: topVenues,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to search venues",
    }
  }
}

export async function searchJudges(criteria: {
  expertise?: string[]
  experience?: string
  theme?: string
}): Promise<ToolResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    let filteredJudges = [...sampleJudges]

    // Filter by expertise
    if (criteria.expertise && criteria.expertise.length > 0) {
      filteredJudges = filteredJudges.filter((judge) =>
        criteria.expertise!.some((exp) =>
          judge.expertise.some((judgeExp) => judgeExp.toLowerCase().includes(exp.toLowerCase())),
        ),
      )
    }

    // Adjust scores based on theme
    if (criteria.theme) {
      const theme = criteria.theme.toLowerCase()
      filteredJudges = filteredJudges.map((judge) => {
        let adjustedScore = judge.matchScore

        if (theme.includes("climate") && judge.expertise.some((exp) => exp.toLowerCase().includes("climate"))) {
          adjustedScore += 8
        }

        if (theme.includes("ai") && judge.expertise.some((exp) => exp.toLowerCase().includes("ai"))) {
          adjustedScore += 8
        }

        if (theme.includes("fintech") && judge.expertise.some((exp) => exp.toLowerCase().includes("fintech"))) {
          adjustedScore += 8
        }

        return { ...judge, matchScore: Math.min(adjustedScore, 100) }
      })
    }

    // Use Cohere rerank for better judge matching
    const query = `hackathon judge ${criteria.theme || ''} expertise ${criteria.expertise?.join(' ') || ''}`
    const rankedJudges = await rerankResults(query.trim(), filteredJudges)
    const topJudges = rankedJudges.slice(0, 3)

    return {
      success: true,
      data: topJudges,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to search judges",
    }
  }
}

export async function searchMentors(criteria: {
  expertise?: string[]
  skills?: string[]
  theme?: string
}): Promise<ToolResult> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  try {
    let filteredMentors = [...sampleMentors]

    // Filter by expertise/skills
    if (criteria.expertise && criteria.expertise.length > 0) {
      filteredMentors = filteredMentors.filter((mentor) =>
        criteria.expertise!.some((exp) =>
          mentor.expertise.some((mentorExp) => mentorExp.toLowerCase().includes(exp.toLowerCase())),
        ),
      )
    }

    if (criteria.skills && criteria.skills.length > 0) {
      filteredMentors = filteredMentors.filter((mentor) =>
        criteria.skills!.some((skill) =>
          mentor.expertise.some((mentorExp) => mentorExp.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    // Adjust scores based on theme
    if (criteria.theme) {
      const theme = criteria.theme.toLowerCase()
      filteredMentors = filteredMentors.map((mentor) => {
        let adjustedScore = mentor.matchScore

        // Boost scores for relevant expertise
        if (theme.includes("web") && mentor.expertise.some((exp) => exp.toLowerCase().includes("react"))) {
          adjustedScore += 6
        }

        if (theme.includes("mobile") && mentor.expertise.some((exp) => exp.toLowerCase().includes("ios"))) {
          adjustedScore += 6
        }

        if (theme.includes("data") && mentor.expertise.some((exp) => exp.toLowerCase().includes("data"))) {
          adjustedScore += 6
        }

        return { ...mentor, matchScore: Math.min(adjustedScore, 100) }
      })
    }

    // Use Cohere rerank for better mentor matching
    const query = `hackathon mentor ${criteria.theme || ''} skills ${criteria.skills?.join(' ') || ''} expertise ${criteria.expertise?.join(' ') || ''}`
    const rankedMentors = await rerankResults(query.trim(), filteredMentors)
    const topMentors = rankedMentors.slice(0, 5)

    return {
      success: true,
      data: topMentors,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to search mentors",
    }
  }
}

export async function searchSponsors(criteria: {
  budget?: number
  theme?: string
  tier?: string
}): Promise<ToolResult> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  try {
    let filteredSponsors = [...sampleSponsors]

    // Filter by tier if specified
    if (criteria.tier) {
      filteredSponsors = filteredSponsors.filter((sponsor) => sponsor.tier === criteria.tier)
    }

    // Adjust scores based on theme
    if (criteria.theme) {
      const theme = criteria.theme.toLowerCase()
      filteredSponsors = filteredSponsors.map((sponsor) => {
        let adjustedScore = sponsor.matchScore

        if (theme.includes("cloud") && (sponsor.name.includes("AWS") || sponsor.name.includes("Google Cloud"))) {
          adjustedScore += 8
        }

        if (theme.includes("fintech") && sponsor.name.includes("Stripe")) {
          adjustedScore += 8
        }

        if (theme.includes("communication") && sponsor.name.includes("Twilio")) {
          adjustedScore += 8
        }

        return { ...sponsor, matchScore: Math.min(adjustedScore, 100) }
      })
    }

    // Use Cohere rerank for better sponsor matching
    const query = `hackathon sponsor ${criteria.theme || ''} budget ${criteria.budget || ''}`
    const rankedSponsors = await rerankResults(query.trim(), filteredSponsors)
    const topSponsors = rankedSponsors.slice(0, 4)

    return {
      success: true,
      data: topSponsors,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to search sponsors",
    }
  }
}

// Cohere reranker implementation
export async function rerankResults(query: string, results: any[], model: string = 'rerank-english-v3.0'): Promise<any[]> {
  try {
    if (!process.env.COHERE_API_KEY) {
      console.warn('COHERE_API_KEY not found, falling back to original order')
      return results
    }

    // Prepare documents for reranking
    const documents = results.map(result => {
      if (result.name && result.description) {
        return `${result.name}: ${result.description}`
      } else if (result.name && result.expertise) {
        return `${result.name}: ${result.expertise.join(', ')}`
      } else if (result.name) {
        return result.name
      }
      return JSON.stringify(result)
    })

    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        query,
        documents,
        top_k: Math.min(results.length, 10),
        return_documents: false
      })
    })

    if (!response.ok) {
      console.warn(`Cohere rerank failed: ${response.statusText}, falling back to original order`)
      return results
    }

    const data = await response.json()
    
    // Reorder results based on Cohere's relevance scores
    const rerankedResults = data.results
      .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
      .map((item: any) => ({
        ...results[item.index],
        cohereRelevance: item.relevance_score
      }))

    return rerankedResults
  } catch (error) {
    console.warn('Cohere rerank error:', error)
    return results
  }
}
