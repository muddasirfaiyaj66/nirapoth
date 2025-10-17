"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, getCurrentUser, isLoading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    const result = await login(data);
    if (result.success) {
      onSuccess?.();

      // Fetch current user to get role
      const userResult = await getCurrentUser();

      if (userResult.success && userResult.user) {
        const role = userResult.user.role;

        // Determine the target URL
        let targetUrl = redirectUrl || "/dashboard";

        // Override with role-specific dashboard if no redirect URL
        if (!redirectUrl) {
          if (role === "CITIZEN") {
            targetUrl = "/dashboard/citizen";
          } else if (role === "POLICE") {
            targetUrl = "/dashboard/police";
          } else if (role === "FIRE_SERVICE") {
            targetUrl = "/dashboard/fire-service";
          } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
            targetUrl = "/dashboard";
          }
        }

        // Use window.location for a hard navigation to ensure cookie is properly set
        // This also ensures the middleware runs with the new cookie
        window.location.href = targetUrl;
      } else {
        // If we can't get user info, fallback to dashboard with hard navigation
        window.location.href = redirectUrl || "/dashboard";
      }
    } else {
      // Map known backend errors to user-friendly messages
      const raw = (result as any)?.error || error;
      const normalized = typeof raw === "string" ? raw : raw?.message || "";
      if (/invalid credentials|unauthorized|wrong password/i.test(normalized)) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (
        /email not verified|verify email|unverified/i.test(normalized)
      ) {
        setErrorMessage(
          "Your email is not verified. Please check your inbox for the verification email."
        );
      } else if (/user not found|no account/i.test(normalized)) {
        setErrorMessage("No account found with this email.");
      } else {
        setErrorMessage("Login failed. Please try again later.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 ">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
