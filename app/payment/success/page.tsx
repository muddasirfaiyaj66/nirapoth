"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { paymentApi } from "@/lib/api/payments";
import { apiCache } from "@/lib/utils/apiCache";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");
  const type = searchParams.get("type"); // "debt" or "fine"
  const debtId = searchParams.get("debtId");
  const fineId = searchParams.get("fineId");

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Handle debt payment success
      if (type === "debt" && debtId) {
        console.log("✅ Debt payment successful! DebtId:", debtId);

        // Clear cache so rewards page shows updated data
        apiCache.invalidatePattern("rewards:");
        console.log("🧹 Cleared rewards cache after payment");

        setVerified(true);
        setVerifying(false);

        // Redirect to rewards page with refresh parameter after ~1.2 seconds
        setTimeout(() => {
          router.push("/dashboard/citizen/rewards?refresh=true");
        }, 1200);
        return;
      }

      // Handle fine payment success (existing logic)
      if (!transactionId) {
        setError("No transaction ID found");
        setVerifying(false);
        return;
      }

      try {
        // Use database verification (authoritative source)
        const response = await paymentApi.verifyTransaction(transactionId);

        if (response.success && response.data?.verified) {
          setVerified(true);
          console.log("✅ Payment verified from database:", response.data);
        } else {
          setError(
            response.data?.reason === "NOT_FOUND"
              ? "Payment record not found"
              : "Payment verification failed"
          );
          console.error("❌ Verification failed:", response.data);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Unable to verify payment");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [transactionId, type, debtId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
                {verifying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {verifying ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Verifying Payment...
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we confirm your transaction
                </p>
              </>
            ) : verified ? (
              <>
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {type === "debt"
                    ? "Your debt has been paid successfully. You will be redirected to your rewards page shortly."
                    : "Your fine has been paid successfully. A confirmation email has been sent to your registered email address."}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Verification Failed
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {error || "Unable to verify your payment"}
                </p>
              </>
            )}

            {/* Transaction Details */}
            {(transactionId || debtId) && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {type === "debt" ? "Debt ID" : "Transaction ID"}
                </p>
                <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                  {type === "debt" ? debtId : transactionId}
                </p>
              </div>
            )}

            {/* Success Details */}
            {verified && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Status
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Fine Status
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Paid
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email Confirmation
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Sent
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => {
                  if (type === "debt") {
                    router.push("/dashboard/citizen/rewards");
                  } else {
                    router.push("/dashboard/citizen/my-reports");
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {type === "debt" ? "View My Rewards" : "View My Reports"}
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

            {/* Additional Info */}
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
              If you have any questions, please contact support or check your
              email for the payment receipt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
