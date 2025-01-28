import { TypeIcon as type, type LucideIcon } from "lucide-react"

interface FeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
      <Icon className="h-12 w-12 text-primary" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}

