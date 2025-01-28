"use client"

import type { LucideIcon } from "lucide-react"

interface AnimatedFeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

export function AnimatedFeature({ icon: Icon, title, description }: AnimatedFeatureProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl fade-in">
      <Icon className="h-12 w-12 text-primary" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}

