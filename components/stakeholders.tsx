import { Car, User, Building2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Stakeholders() {
  const stakeholders = [
    {
      icon: BadgeCheck,
      title: "Police Stations",
      description:
        "Monitor jurisdiction, review cases, manage appeals, and track citizen reports",
      features: [
        "Case management",
        "Appeal reviews",
        "Citizen report validation",
        "Analytics dashboard",
      ],
    },
    {
      icon: User,
      title: "Citizens",
      description:
        "Report violations, track complaints, earn rewards for valid reports",
      features: [
        "Submit photo/video evidence",
        "Track report status",
        "Earn 5% rewards",
        "View accident statistics",
      ],
    },
    {
      icon: Car,
      title: "Vehicle Owners",
      description:
        "View violations, pay fines, submit appeals, track vehicle history",
      features: [
        "Violation history",
        "Online fine payment",
        "Appeal submission",
        "Insurance tracking",
      ],
    },
    {
      icon: Building2,
      title: "City Corporation",
      description:
        "Manage infrastructure complaints and track resolution progress",
      features: [
        "Infrastructure reports",
        "Status updates",
        "Location filtering",
        "Maintenance tracking",
      ],
    },
  ];

  return (
    <section id="stakeholders" className="py-24 bg-card dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl text-foreground">
            Built for Every Stakeholder
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            Customized dashboards and features for each user type
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {stakeholders.map((stakeholder, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/50 bg-muted/30 p-8"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stakeholder.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">
                {stakeholder.title}
              </h3>
              <p className="mb-6 text-foreground/70">
                {stakeholder.description}
              </p>
              <ul className="mb-6 space-y-2">
                {stakeholder.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-primary/5"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
