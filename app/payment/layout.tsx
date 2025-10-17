import type React from "react";

export const metadata = {
  title: "Payment - NiraPoth",
  description: "Payment processing page",
};

// Disable static generation for payment pages to prevent SSR URL construction errors
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
