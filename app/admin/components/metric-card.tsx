"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  icon: LucideIcon
  title: string
  value: string
  trend: number
  trendIcon: LucideIcon
  trendLabel: string
}

export function MetricCard({ icon: Icon, title, value, trend, trendIcon: TrendIcon, trendLabel }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="bg-[#1A1A1A] border-gray-800 p-6 hover:bg-[#222222] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 group">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            </div>
            <div
              className={`rounded-full p-2 ${trend > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendIcon className={`h-4 w-4 mr-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`} />
            <span className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">{trendLabel}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

