import { NextRequest, NextResponse } from "next/server";

/**
 * API route to handle SSLCommerz payment callbacks
 * This handles both GET (user redirects) and POST (IPN notifications)
 */

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // For GET requests, also check if we need to process a debt payment
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const debtId = searchParams.get("debtId");

    // SSLCommerz sends these parameters in the redirect
    const val_id = searchParams.get("val_id");
    const tran_id = searchParams.get("tran_id");
    const amount = searchParams.get("amount");
    const card_type = searchParams.get("card_type");
    const status = searchParams.get("status");

    console.log("📬 SSLCommerz GET redirect received:", {
      type,
      debtId,
      val_id,
      tran_id,
      amount,
      card_type,
      status,
    });

    // If it's a debt payment, process it
    if (type === "debt" && debtId && tran_id) {
      try {
        console.log("💰 Processing debt payment from GET redirect");

        // Call backend API to process the debt payment
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${backendUrl}/api/payments/process-debt-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              debtId,
              transactionId: tran_id,
              amount: amount ? parseFloat(amount) : undefined,
              valId: val_id,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log("✅ Debt payment processed successfully:", result);
        } else {
          console.error("⚠️ Debt payment processing failed:", result.message);
        }
      } catch (error) {
        console.error("❌ Error processing debt payment from GET:", error);
        // Continue to redirect even if processing fails - user will see the success page
      }
    }

    // Redirect to the payment success page with all parameters
    const redirectUrl = new URL("/payment/success", request.url);
    searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error in GET callback:", error);

    // Redirect to error page
    const errorUrl = new URL("/payment/failed", request.url);
    errorUrl.searchParams.set("error", "callback_failed");

    return NextResponse.redirect(errorUrl);
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const debtId = searchParams.get("debtId");
    const fineId = searchParams.get("fineId");

    console.log("📬 SSLCommerz POST callback received at API:", {
      type,
      debtId,
      fineId,
      url: request.url,
    });

    // Get the form data from SSLCommerz
    const formData = await request.formData();
    const transactionId = formData.get("tran_id")?.toString();
    const status = formData.get("status")?.toString();
    const valId = formData.get("val_id")?.toString();
    const amount = formData.get("amount")?.toString();

    console.log("💳 Payment callback data:", {
      transactionId,
      status,
      valId,
      amount,
      type,
      debtId,
      fineId,
    });

    // If payment is successful and it's a debt payment, process it immediately
    if (
      status === "VALID" &&
      type === "debt" &&
      debtId &&
      transactionId &&
      amount
    ) {
      try {
        console.log("💰 Processing debt payment:", {
          debtId,
          amount,
          transactionId,
        });

        // Call backend API to process the debt payment
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${backendUrl}/api/payments/process-debt-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              debtId,
              transactionId,
              amount: parseFloat(amount),
              valId,
            }),
          }
        );

        const result = await response.json();
        console.log("✅ Debt payment processed:", result);
      } catch (error) {
        console.error("❌ Error processing debt payment:", error);
        // Continue to redirect even if processing fails
      }
    }

    // Build redirect URL for the user's browser
    const redirectUrl = new URL("/payment/success", request.url);

    if (type) redirectUrl.searchParams.set("type", type);
    if (debtId) redirectUrl.searchParams.set("debtId", debtId);
    if (fineId) redirectUrl.searchParams.set("fineId", fineId);
    if (transactionId)
      redirectUrl.searchParams.set("transactionId", transactionId);

    console.log("🔄 Redirecting to:", redirectUrl.toString());

    // Return 303 See Other to convert POST to GET
    return NextResponse.redirect(redirectUrl, {
      status: 303,
    });
  } catch (error) {
    console.error("❌ Error handling payment callback:", error);

    // Redirect to error page
    const errorUrl = new URL("/payment/failed", request.url);
    errorUrl.searchParams.set("error", "callback_failed");

    return NextResponse.redirect(errorUrl, {
      status: 303,
    });
  }
}
