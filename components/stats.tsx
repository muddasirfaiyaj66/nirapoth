export function Stats() {
  const stats = [
    { value: "24/7", label: "AI Monitoring", color: "text-primary" },
    { value: "< 2min", label: "Emergency Response", color: "text-accent" },
    { value: "100%", label: "Transparency", color: "text-primary" },
    { value: "5%", label: "Citizen Rewards", color: "text-accent" },
  ];

  return (
    <section className="border-y border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className={`mb-3 text-4xl font-bold transition-all duration-300 group-hover:scale-110 md:text-5xl ${stat.color}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
