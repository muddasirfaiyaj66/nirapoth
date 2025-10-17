"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchMyLicense } from "@/lib/store/slices/drivingLicenseSlice";
import { DrivingLicenseCard } from "@/components/citizen/DrivingLicenseCard";
import { AddLicenseForm } from "@/components/citizen/AddLicenseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Plus, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function DrivingLicensePage() {
  const dispatch = useAppDispatch();
  const { license, loading, error } = useAppSelector(
    (state) => state.drivingLicense
  );
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMyLicense());
  }, [dispatch]);

  const handleLicenseAdded = () => {
    toast.success("Driving license added successfully! You received 10 gems!");
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading your driving license...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Driving License
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your driving license and track your gems
          </p>
        </div>
      </div>

      {/* Gem System Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Gem System:</strong> You start with 10 gems when you add your
          license. Police can deduct gems for violations. If gems reach 0, your
          license will be blacklisted and you must pay ৳5000 penalty and reapply
          for the driving test.
        </AlertDescription>
      </Alert>

      {/* License Card or Add Form */}
      {license ? (
        <div className="space-y-6">
          {/* Show blacklist warning if applicable */}
          {license.isBlacklisted && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>License Blacklisted!</strong> Your license has been
                blacklisted because all gems were depleted. You must pay a ৳5000
                penalty and reapply for the driving test.
                {license.blacklistReason && (
                  <p className="mt-2 text-sm">
                    Reason: {license.blacklistReason}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* License Card */}
          <DrivingLicenseCard
            license={license}
            onUpdate={() => dispatch(fetchMyLicense())}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Driving License Found</CardTitle>
            <CardDescription>
              Add your driving license to receive 10 gems and start tracking
              your driving record
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showAddForm ? (
              <Button onClick={() => setShowAddForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Driving License
              </Button>
            ) : (
              <AddLicenseForm
                onSuccess={handleLicenseAdded}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
