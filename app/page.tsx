import { Suspense } from "react"
import { InteractiveContent } from "./InteractiveContent"

export default function Home() {
  return (
    <div>
      <h1>Welcome to Cashora</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <InteractiveContent />
      </Suspense>
    </div>
  )
}

