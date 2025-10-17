"use client";

import { DrivingLicense } from "@/lib/api/drivingLicense";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

interface DrivingLicenseCardProps {
  license: DrivingLicense;
  onUpdate?: () => void;
}

const LICENSE_CATEGORY_NAMES: Record<string, string> = {
  MOTORCYCLE: "Motorcycle",
  LIGHT_VEHICLE: "Light Vehicle",
  LIGHT_VEHICLE_MOTORCYCLE: "Light Vehicle + Motorcycle",
  HEAVY_VEHICLE: "Heavy Vehicle",
  PUBLIC_SERVICE_VEHICLE: "Public Service Vehicle",
  GOODS_VEHICLE: "Goods Vehicle",
};

export function DrivingLicenseCard({
  license,
  onUpdate,
}: DrivingLicenseCardProps) {
  const isExpired = new Date(license.expiryDate) < new Date();
  const isExpiringSoon =
    new Date(license.expiryDate) <
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const getGemStatus = () => {
    if (license.gems === 0)
      return { color: "bg-red-500", label: "Blacklisted" };
    if (license.gems <= 3) return { color: "bg-orange-500", label: "Critical" };
    if (license.gems <= 5) return { color: "bg-yellow-500", label: "Warning" };
    return { color: "bg-green-500", label: "Good" };
  };

  const gemStatus = getGemStatus();

  return (
    <div className="space-y-4">
      {/* Bangladesh Driving License Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-6 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">
                People's Republic of Bangladesh
              </p>
              <h2 className="text-2xl font-bold tracking-wide">
                DRIVING LICENCE
              </h2>
            </div>
            <Shield className="h-16 w-16 opacity-80" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-white/20 rounded-lg border-2 border-white/40 flex items-center justify-center mb-2">
              {license.citizen.profileImage ? (
                <img
                  src={license.citizen.profileImage}
                  alt={`${license.citizen.firstName} ${license.citizen.lastName}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-white/60 text-center">
                  <p className="text-sm">Photo</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">License No.</p>
              <p className="text-lg font-bold tracking-wider">
                {license.licenseNo}
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3 md:col-span-2">
            <div>
              <p className="text-xs opacity-75 uppercase">Full Name</p>
              <p className="text-xl font-bold">
                {license.citizen.firstName} {license.citizen.lastName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-75 uppercase">Date of Birth</p>
                <p className="font-semibold">
                  {license.citizen.dateOfBirth
                    ? format(
                        new Date(license.citizen.dateOfBirth),
                        "dd MMM yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75 uppercase">Category</p>
                <p className="font-semibold">
                  {LICENSE_CATEGORY_NAMES[license.category] || license.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-75 uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Issue Date
                </p>
                <p className="font-semibold">
                  {format(new Date(license.issueDate), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75 uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Expiry Date
                </p>
                <p className="font-semibold">
                  {format(new Date(license.expiryDate), "dd MMM yyyy")}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs opacity-75 uppercase">Issuing Authority</p>
              <p className="font-semibold">{license.issuingAuthority}</p>
            </div>
          </div>
        </div>

        {/* Footer with Status Indicators */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {license.isVerified ? (
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-yellow-500/20 text-white border-0"
              >
                Pending Verification
              </Badge>
            )}

            {isExpired && (
              <Badge variant="destructive" className="border-0">
                Expired
              </Badge>
            )}

            {isExpiringSoon && !isExpired && (
              <Badge className="bg-orange-500 text-white border-0">
                Expiring Soon
              </Badge>
            )}
          </div>

          <div className="text-xs opacity-75">
            ID: {license.id.substring(0, 8)}...
          </div>
        </div>
      </Card>

      {/* Gem Status Card */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold">Driving Gems</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your current driving score based on violations
            </p>
          </div>

          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${gemStatus.color} text-white shadow-lg`}
            >
              <div>
                <p className="text-4xl font-bold">{license.gems}</p>
                <p className="text-xs uppercase tracking-wide">Gems</p>
              </div>
            </div>
            <Badge className={`mt-2 ${gemStatus.color} text-white border-0`}>
              {gemStatus.label}
            </Badge>
          </div>
        </div>

        {/* Gem Status Messages */}
        <div className="mt-4 space-y-2">
          {license.isBlacklisted && (
            <div className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  License Blacklisted
                </p>
                <p className="text-red-700 dark:text-red-300">
                  All gems depleted. You must pay ৳5000 penalty and reapply for
                  the driving test.
                </p>
                {license.blacklistReason && (
                  <p className="text-red-600 dark:text-red-400 mt-1 text-xs">
                    Reason: {license.blacklistReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {!license.isBlacklisted && license.gems <= 3 && (
            <div className="flex items-start gap-2 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  Critical Warning
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  You have only {license.gems} gem
                  {license.gems !== 1 ? "s" : ""} left. Drive carefully to avoid
                  blacklisting!
                </p>
              </div>
            </div>
          )}

          {!license.isBlacklisted && license.gems > 3 && license.gems <= 5 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Warning
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Your gems are running low. Be cautious while driving.
                </p>
              </div>
            </div>
          )}

          {!license.isBlacklisted && license.gems > 5 && (
            <div className="flex items-start gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Good Standing
                </p>
                <p className="text-green-700 dark:text-green-300">
                  Your driving record is in good condition. Keep it up!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Violation Stats */}
        {license.violationCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Violations:</span>
              <span className="font-bold">{license.violationCount}</span>
            </div>
            {license.lastViolationAt && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Last Violation:</span>
                <span className="font-semibold">
                  {format(new Date(license.lastViolationAt), "dd MMM yyyy")}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
