import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-card dark:bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/30 bg-muted/50 p-6 sm:p-8 md:p-12 lg:p-16 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Ready to Make Roads Safer?
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-foreground/70 px-2 sm:px-0">
            Join thousands of citizens, police officers, and authorities using
            NiraPoth
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto hover:bg-primary/5"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
