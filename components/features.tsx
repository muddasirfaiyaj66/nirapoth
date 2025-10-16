import {
  Camera,
  Zap,
  Users,
  Shield,
  AlertTriangle,
  FileText,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Camera,
      title: "AI-Powered Detection",
      description:
        "Automatic detection of accidents, speeding, wrong-side driving, and traffic violations using advanced AI cameras.",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description:
        "Instant alerts to police and fire services when accidents are detected, ensuring rapid emergency response.",
    },
    {
      icon: Zap,
      title: "Automated Enforcement",
      description:
        "Digital cases filed automatically for violations. Vehicle owners can view and pay fines through their dashboard.",
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description:
        "Report violations with photo/video evidence. Earn 5% rewards for valid reports, promoting community engagement.",
    },
    {
      icon: Shield,
      title: "Accountability System",
      description:
        "Driver gem system tracks violations. Excessive offenses lead to blacklisting, ensuring responsible driving.",
    },
    {
      icon: FileText,
      title: "Transparent Appeals",
      description:
        "Vehicle owners can dispute fines. Police review appeals to ensure fair and accurate enforcement.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-card dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl text-foreground">
            Comprehensive Road Safety Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            A complete ecosystem for monitoring, enforcement, and citizen
            engagement
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-lg border border-border/50 bg-muted/30 p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
