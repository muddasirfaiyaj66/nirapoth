export function Stats() {
  const stats = [
    { value: "24/7", label: "AI Monitoring" },
    { value: "< 2min", label: "Emergency Response" },
    { value: "100%", label: "Transparency" },
    { value: "5%", label: "Citizen Rewards" },
  ]

  return (
    <section className="border-y border-border bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
