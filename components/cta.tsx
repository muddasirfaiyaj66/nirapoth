import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center md:p-16">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Make Roads Safer?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of citizens, police officers, and authorities using NiraPoth
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
