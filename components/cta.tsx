import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-card dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-primary/30 bg-muted/50 p-12 text-center md:p-16">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl text-foreground">
            Ready to Make Roads Safer?
          </h2>
          <p className="mb-8 text-lg text-foreground/70">
            Join thousands of citizens, police officers, and authorities using
            NiraPoth
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="hover:bg-primary/5">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
