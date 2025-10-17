"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchProfile,
  fetchStatistics,
  validateProfile,
  clearError,
} from "@/lib/store/slices/profileSlice";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, AlertCircle } from "lucide-react";

const SimpleUserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redux state
  const {
    profile,
    statistics,
    validation,
    loading,
    statisticsLoading,
    validationLoading,
    error,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Clear any existing errors
    dispatch(clearError());

    // Fetch profile data
    dispatch(fetchProfile());
    dispatch(fetchStatistics());
    dispatch(validateProfile());
  }, [dispatch, isAuthenticated, router]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchProfile())}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p>No profile data available</p>
          <Button onClick={() => dispatch(fetchProfile())} className="mt-4">
            Reload Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>
        <p className="text-gray-600 mt-2">Your profile information</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                First Name
              </label>
              <p className="text-lg">{profile.firstName || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Name
              </label>
              <p className="text-lg">{profile.lastName || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-lg">{profile.phone || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg">{profile.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="text-lg">
                {profile.isActive ? "Active" : "Inactive"} •
                {profile.isEmailVerified ? " Verified" : " Unverified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      {statistics && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {statisticsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statistics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {value || 0}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Card */}
      {validation && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Validation</CardTitle>
          </CardHeader>
          <CardContent>
            {validationLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div>
                <p className="mb-2">
                  Profile Completion: {validation.completionPercentage}%
                </p>
                <p className="text-sm text-gray-600">
                  Status: {validation.isComplete ? "Complete" : "Incomplete"}
                </p>
                {validation.missingFields &&
                  validation.missingFields.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-600">
                        Missing Fields:
                      </p>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {validation.missingFields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <p>Loading: {loading ? "Yes" : "No"}</p>
          <p>Error: {error || "None"}</p>
          <p>Profile ID: {profile?.id}</p>
          <p>Statistics Loading: {statisticsLoading ? "Yes" : "No"}</p>
          <p>Validation Loading: {validationLoading ? "Yes" : "No"}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleUserProfile;
