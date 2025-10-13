"use client";

import { EmailVerification } from "@/components/auth/EmailVerification";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <EmailVerification />
    </div>
  );
}
