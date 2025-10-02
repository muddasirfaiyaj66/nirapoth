export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "AI Detection",
      description: "Smart cameras continuously monitor roads for violations and accidents",
    },
    {
      number: "02",
      title: "Instant Alert",
      description: "System automatically notifies relevant authorities and files digital cases",
    },
    {
      number: "03",
      title: "Notification",
      description: "Vehicle owners receive notifications with case details and payment options",
    },
    {
      number: "04",
      title: "Resolution",
      description: "Pay fines online or submit appeals for review by local authorities",
    },
  ]

  return (
    <section id="how-it-works" className="bg-muted py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A seamless process from detection to resolution
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-4 text-6xl font-bold text-primary/20">{step.number}</div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
