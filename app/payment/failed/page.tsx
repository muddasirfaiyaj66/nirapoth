"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type"); // "debt" or "fine"
  const debtId = searchParams.get("debtId");
  const fineId = searchParams.get("fineId");
  const message =
    searchParams.get("message") || "Payment failed. Please try again.";

  const handleRetry = () => {
    if (type === "debt" && debtId) {
      router.push("/dashboard/citizen/rewards");
    } else if (type === "fine" || fineId) {
      router.push("/dashboard/citizen/my-reports");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
                Payment Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {decodeURIComponent(message)}
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-left space-y-2">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                    Possible Reasons:
                  </p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
                    <li>Insufficient balance</li>
                    <li>Card declined by bank</li>
                    <li>Incorrect card details</li>
                    <li>Transaction timeout</li>
                    <li>Network connectivity issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What to Do Next */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                What to do next:
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>Verify your card details and balance</li>
                <li>Try a different payment method</li>
                <li>Contact your bank if the issue persists</li>
                <li>Reach out to our support team for assistance</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>

            {/* Support Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="mb-2">Need help?</p>
              <p>
                Contact support at{" "}
                <a
                  href="mailto:support@nirapoth.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@nirapoth.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-red-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
