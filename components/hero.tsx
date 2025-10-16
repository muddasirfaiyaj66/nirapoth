import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { ThreeDAccidentScene } from "./three-d-accident-scene";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 bg-white bg-opacity-20 dark:bg-transparent">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge with fade-in animation */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary animate-fade-in">
            <Shield className="h-4 w-4" />
            <span>AI-Powered Road Safety Platform</span>
          </div>

          {/* Headline with staggered animation */}
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl text-foreground animate-slide-up">
            Making Roads Safer Through{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Technology
            </span>{" "}
            and{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transparency
            </span>
          </h1>

          {/* Subtitle with fade-in animation */}
          <p className="mb-10 text-pretty text-lg text-foreground/70 md:text-xl animate-fade-in animation-delay-200">
            NiraPoth combines AI-powered monitoring, citizen participation, and
            digital enforcement to create safer roads for everyone. Real-time
            accident detection, automated violation tracking, and transparent
            accountability.
          </p>

          {/* CTA Buttons with scale animation */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in animation-delay-400">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-primary/5 transition-all duration-300 transform hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>

          {/* 3D Accident Detection Scene */}
          <div className="mt-16 animate-scale-in animation-delay-600">
            <ThreeDAccidentScene />
          </div>
        </div>
      </div>
    </section>
  );
}
