"use client"
import { Card } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="transition-all duration-300 hover:-translate-y-2">
      <Card className="p-6">
        <div className="text-4xl">{icon}</div>
        <h3 className="mt-4 text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </Card>
    </div>
  )
}

