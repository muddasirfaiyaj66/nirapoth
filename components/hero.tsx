import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Shield className="h-4 w-4" />
            <span>AI-Powered Road Safety Platform</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl text-white">
            Making Roads Safer Through{" "}
            <span className="text-green-gradient">Technology</span> and{" "}
            <span className="text-green-gradient">Transparency</span>
          </h1>

          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
            NiraPoth combines AI-powered monitoring, citizen participation, and
            digital enforcement to create safer roads for everyone. Real-time
            accident detection, automated violation tracking, and transparent
            accountability.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          <div className="mt-16">
            <div className="rounded-lg border border-border bg-muted/50 shadow-2xl overflow-hidden">
              <img
                src="/modern-traffic-monitoring-dashboard-with-ai-analyt.jpg"
                alt="NiraPoth Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
