"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ban, Info, Loader2 } from "lucide-react";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type"); // "debt" or "fine"
  const debtId = searchParams.get("debtId");
  const fineId = searchParams.get("fineId");

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Cancel Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Ban className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            {/* Cancel Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                Payment Cancelled
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                You have cancelled the payment process.
              </p>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-left space-y-2">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    What happened?
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    The payment was cancelled before completion. Your{" "}
                    {type === "debt" ? "debt" : "fine"} remains unpaid and no
                    charges were made to your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Status
                </span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  Cancelled
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {type === "debt" ? "Debt Status" : "Fine Status"}
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  Still Unpaid
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Amount Charged
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ৳0
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                ⚠️ Important Notice:
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Your {type === "debt" ? "debt" : "fine"} is still unpaid and may
                accrue late payment penalties. Please complete the payment at
                your earliest convenience to avoid additional charges.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {type === "debt" ? "Pay Debt Now" : "Pay Fine Now"}
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

            {/* Help Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
              If you cancelled by mistake, you can try again anytime from your
              {type === "debt" ? " rewards" : " fines"} page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-yellow-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  );
}
