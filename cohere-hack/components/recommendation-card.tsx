import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecommendationCardProps {
  title: string
  subtitle: string
  description: string
  matchScore: number
  confidence: number
  details: string[]
}

export function RecommendationCard({
  title,
  subtitle,
  description,
  matchScore,
  confidence,
  details,
}: RecommendationCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score >= 80) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {matchScore}% match
            </Badge>
            <Badge className={`text-xs ${getConfidenceColor(confidence)}`}>{confidence}% confidence</Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        <div className="space-y-1">
          {details.map((detail, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              • {detail}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
