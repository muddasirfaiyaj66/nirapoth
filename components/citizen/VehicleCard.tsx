"use client";

import { Vehicle } from "@/lib/api/vehicle";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { deleteVehicle } from "@/lib/store/slices/vehicleManagementSlice";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate: () => void;
  onDelete: () => void;
}

const VEHICLE_ICONS: Record<string, string> = {
  CAR: "🚗",
  MOTORCYCLE: "🏍️",
  TRUCK: "🚚",
  BUS: "🚌",
  BICYCLE: "🚲",
  OTHER: "🚙",
};

const VEHICLE_COLORS: Record<
  string,
  { from: string; to: string; border: string }
> = {
  CAR: { from: "from-blue-500", to: "to-blue-700", border: "border-blue-300" },
  MOTORCYCLE: {
    from: "from-cyan-500",
    to: "to-teal-600",
    border: "border-cyan-300",
  },
  TRUCK: {
    from: "from-gray-600",
    to: "to-gray-800",
    border: "border-gray-400",
  },
  BUS: {
    from: "from-green-500",
    to: "to-green-700",
    border: "border-green-300",
  },
  BICYCLE: {
    from: "from-purple-500",
    to: "to-purple-700",
    border: "border-purple-300",
  },
  OTHER: {
    from: "from-slate-500",
    to: "to-slate-700",
    border: "border-slate-300",
  },
};

export function VehicleCard({ vehicle, onUpdate, onDelete }: VehicleCardProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.vehicleManagement);

  const icon = VEHICLE_ICONS[vehicle.type] || "🚙";
  const colors = VEHICLE_COLORS[vehicle.type] || VEHICLE_COLORS.OTHER;

  const isExpired = vehicle.expiresAt
    ? new Date(vehicle.expiresAt) < new Date()
    : false;
  const isExpiringSoon =
    vehicle.expiresAt &&
    new Date(vehicle.expiresAt) <
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(vehicle.id)).unwrap();
      onDelete();
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast.error(error || "Failed to delete vehicle");
    }
  };

  const violationCount = vehicle.violations?.length || 0;
  const unpaidViolations =
    vehicle.violations?.filter((v) => v.fine?.status === "UNPAID").length || 0;

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${colors.from} ${colors.to} text-white border-4 ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 text-9xl">{icon}</div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-4xl sm:text-6xl">{icon}</div>
            <div>
              <Badge
                variant="secondary"
                className="mb-1 sm:mb-2 bg-white/20 text-white border-0 text-xs sm:text-sm"
              >
                {vehicle.type}
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold tracking-wider">
                {vehicle.plateNo}
              </h3>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this vehicle? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-white/20">
          {vehicle.brand && (
            <div>
              <p className="text-xs opacity-75 uppercase">Brand</p>
              <p className="font-semibold text-sm sm:text-base">
                {vehicle.brand}
              </p>
            </div>
          )}
          {vehicle.model && (
            <div>
              <p className="text-xs opacity-75 uppercase">Model</p>
              <p className="font-semibold text-sm sm:text-base">
                {vehicle.model}
              </p>
            </div>
          )}
          {vehicle.year && (
            <div>
              <p className="text-xs opacity-75 uppercase">Year</p>
              <p className="font-semibold text-sm sm:text-base">
                {vehicle.year}
              </p>
            </div>
          )}
          {vehicle.color && (
            <div>
              <p className="text-xs opacity-75 uppercase">Color</p>
              <p className="font-semibold text-sm sm:text-base">
                {vehicle.color}
              </p>
            </div>
          )}
        </div>

        {/* Registration Info */}
        <div className="space-y-2 pt-3 sm:pt-4 border-t border-white/20">
          <div>
            <p className="text-xs opacity-75 uppercase">Engine Number</p>
            <p className="font-mono text-xs sm:text-sm break-all">
              {vehicle.engineNo}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75 uppercase">Chassis Number</p>
            <p className="font-mono text-xs sm:text-sm break-all">
              {vehicle.chassisNo}
            </p>
          </div>
          {vehicle.registrationNo && (
            <div>
              <p className="text-xs opacity-75 uppercase">Tax Token Number</p>
              <p className="font-mono text-xs sm:text-sm break-all">
                {vehicle.registrationNo}
              </p>
            </div>
          )}
          {vehicle.registrationDate && (
            <div>
              <p className="text-xs opacity-75 uppercase">Registration Date</p>
              <p className="font-mono text-xs sm:text-sm">
                {format(new Date(vehicle.registrationDate), "dd MMM yyyy")}
              </p>
            </div>
          )}
        </div>

        {/* Status and Violations */}
        <div className="pt-3 sm:pt-4 border-t border-white/20 space-y-2 sm:space-y-3">
          {/* Tax Token Expiry */}
          {vehicle.expiresAt && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Tax Token Expires:</span>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold text-sm sm:text-base">
                  {format(new Date(vehicle.expiresAt), "dd MMM yyyy")}
                </p>
                {isExpired && (
                  <Badge
                    variant="destructive"
                    className="mt-1 border-0 text-xs"
                  >
                    Expired
                  </Badge>
                )}
                {isExpiringSoon && !isExpired && (
                  <Badge className="mt-1 bg-orange-500 text-white border-0 text-xs">
                    Expiring Soon
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Violations */}
          {violationCount > 0 && (
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2">
                {unpaidViolations > 0 ? (
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                )}
                <div>
                  <p className="text-xs sm:text-sm font-semibold">
                    {violationCount} Violation{violationCount !== 1 ? "s" : ""}
                  </p>
                  {unpaidViolations > 0 && (
                    <p className="text-xs opacity-75">
                      {unpaidViolations} unpaid
                    </p>
                  )}
                </div>
              </div>
              {unpaidViolations > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs">
                  Action Required
                </Badge>
              )}
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm">Status:</span>
            {vehicle.isActive ? (
              <Badge className="bg-green-500 text-white border-0 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-red-500/20 text-white border-0 text-xs"
              >
                Inactive
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 sm:pt-4 border-t border-white/20 text-xs opacity-75">
          Registered on {format(new Date(vehicle.registeredAt), "dd MMM yyyy")}
        </div>
      </div>
    </Card>
  );
}
