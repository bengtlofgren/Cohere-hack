import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface StatusIndicatorProps {
  status: "pending" | "in-progress" | "completed" | "error"
  label: string
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          iconColor: "text-green-600",
        }
      case "in-progress":
        return {
          icon: Clock,
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          iconColor: "text-blue-600",
        }
      case "error":
        return {
          icon: AlertCircle,
          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          iconColor: "text-red-600",
        }
      default:
        return {
          icon: Clock,
          className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          iconColor: "text-gray-600",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge className={`flex items-center gap-1 text-xs ${config.className}`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} />
      {label}
    </Badge>
  )
}
