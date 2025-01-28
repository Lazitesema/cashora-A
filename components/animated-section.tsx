"use client"

import { cn } from "@/lib/utils"

export function AnimatedSection({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("fade-in", className)} {...props}>
      {children}
    </div>
  )
}

