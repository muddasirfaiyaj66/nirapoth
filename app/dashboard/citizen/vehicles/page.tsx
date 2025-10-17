"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchMyVehicles } from "@/lib/store/slices/vehicleManagementSlice";
import { VehicleCard } from "@/components/citizen/VehicleCard";
import { AddVehicleForm } from "@/components/citizen/AddVehicleForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Car } from "lucide-react";
import { toast } from "sonner";

export default function VehiclesPage() {
  const dispatch = useAppDispatch();
  const { vehicles, loading } = useAppSelector(
    (state) => state.vehicleManagement
  );
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMyVehicles());
  }, [dispatch]);

  const handleVehicleAdded = () => {
    toast.success("Vehicle registered successfully!");
    setShowAddForm(false);
  };

  const handleVehicleDeleted = () => {
    toast.success("Vehicle removed successfully!");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your vehicles...</p>
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
            <Car className="h-8 w-8" />
            My Vehicles
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered vehicles and view their records
          </p>
        </div>
        {vehicles.length > 0 && !showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Vehicle</CardTitle>
            <CardDescription>Add a new vehicle to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <AddVehicleForm
              onSuccess={handleVehicleAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Vehicles List */}
      {vehicles.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Vehicles Found</CardTitle>
            <CardDescription>
              Register your first vehicle to start tracking its records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Register Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onUpdate={() => dispatch(fetchMyVehicles())}
              onDelete={handleVehicleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
