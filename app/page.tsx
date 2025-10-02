import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Stakeholders } from "@/components/stakeholders"
import { Stats } from "@/components/stats"
import { HowItWorks } from "@/components/how-it-works"
import { CTA } from "@/components/cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Stakeholders />
      <CTA />
    </main>
  )
}
