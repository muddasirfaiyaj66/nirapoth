import { NextRequest, NextResponse } from "next/server";

/**
 * API route to handle SSLCommerz payment cancelled callbacks
 * This handles both GET (user redirects) and POST (IPN notifications)
 */

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // For GET requests, redirect to the payment cancelled page
  const searchParams = request.nextUrl.searchParams;

  const redirectUrl = new URL("/payment/cancelled", request.url);
  searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(redirectUrl);
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const debtId = searchParams.get("debtId");
    const fineId = searchParams.get("fineId");

    console.log("📬 SSLCommerz POST cancelled callback received at API:", {
      type,
      debtId,
      fineId,
      url: request.url,
    });

    // Get the form data from SSLCommerz
    const formData = await request.formData();
    const transactionId = formData.get("tran_id")?.toString();
    const status = formData.get("status")?.toString();

    console.log("💳 Payment cancelled callback data:", {
      transactionId,
      status,
      type,
      debtId,
      fineId,
    });

    // Build redirect URL for the user's browser
    const redirectUrl = new URL("/payment/cancelled", request.url);

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
    console.error("❌ Error handling payment cancelled callback:", error);

    // Redirect to error page
    const errorUrl = new URL("/payment/cancelled", request.url);
    errorUrl.searchParams.set("error", "callback_failed");

    return NextResponse.redirect(errorUrl, {
      status: 303,
    });
  }
}
