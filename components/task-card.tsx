"use client"
import { Clock, DollarSign } from "lucide-react"

interface TaskCardProps {
  id: number
  title: string
  description: string
  reward: number
  complexity: string
  estimatedTime: string
  available: number
  type: "image" | "audio" | "text"
  onClick: () => void
}

export function TaskCard({
  id,
  title,
  description,
  reward,
  complexity,
  estimatedTime,
  available,
  type,
  onClick,
}: TaskCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white transition-all duration-200 hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <div className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 text-xs rounded-full">
            {complexity}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{reward} Pts</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{estimatedTime}</span>
          </div>
          <div>Доступно: {available}</div>
        </div>
      </div>
      <div className="bg-blue-600 text-white py-2 px-4 text-center font-medium">Начать задание</div>
    </div>
  )
}
