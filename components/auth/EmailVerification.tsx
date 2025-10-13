"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function EmailVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setError("No verification token provided");
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || "Email verification failed");
        }
      } catch (err: any) {
        setError(err.message || "Email verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, verifyEmail]);

  if (isVerifying) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verifying Email
          </CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">
            This may take a few moments...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-600">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-center">
            Your email address has been verified
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Welcome to Nirapoth! Your account is now fully activated. You can
            now sign in to your account.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-red-600">
          Verification Failed
        </CardTitle>
        <CardDescription className="text-center">
          We couldn't verify your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          The verification link may be invalid or expired. Please try requesting
          a new verification email.
        </p>
        <div className="space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/signup">Sign Up Again</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
