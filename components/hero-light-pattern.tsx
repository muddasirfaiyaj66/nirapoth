"use client";

export function HeroLightPattern() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-white [&>div]:absolute [&>div]:h-full [&>div]:w-full [&>div]:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [&>div]:[background-size:16px_16px] [&>div]:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-slate-900">
            Your Next Great
            <span className="block text-sky-900">Project</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-700">
            Build modern and beautiful websites with this collection of stunning
            background patterns. Perfect for landing pages, apps, and
            dashboards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-lg px-6 py-3 font-medium bg-sky-900 text-white hover:bg-sky-800 transition-colors">
              Get Started
            </button>
            <button className="rounded-lg border border-slate-200 px-6 py-3 font-medium bg-white text-slate-900 hover:bg-slate-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
