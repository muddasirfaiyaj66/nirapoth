import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Traffic Navigation - NiraPoth",
  description: "Real-time traffic monitoring and route optimization",
}

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return children
}
