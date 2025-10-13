"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchVehicles,
  addVehicle,
  assignSelfAsDriver,
  Vehicle as VehicleType,
} from "@/lib/store/slices/vehiclesSlice";
import {
  fetchLicenses,
  DrivingLicense,
} from "@/lib/store/slices/licensesSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  Car,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AddVehicleFormData {
  plateNo: string;
  registrationNo: string;
  engineNo: string;
  chassisNo: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  type: "CAR" | "MOTORCYCLE" | "TRUCK" | "BUS" | "BICYCLE" | "OTHER";
  expiresAt: string;
}

interface SelfAssignFormData {
  vehicleId: string;
  drivingLicenseId: string;
  notes: string;
  validUntil: string;
}

export function VehicleAssignmentManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    vehicles,
    isLoading: vehiclesLoading,
    error: vehiclesError,
  } = useSelector((state: RootState) => state.vehicles);
  const { licenses, isLoading: licensesLoading } = useSelector(
    (state: RootState) => state.licenses
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [isSelfAssignDialogOpen, setIsSelfAssignDialogOpen] = useState(false);
  const [selectedVehicleForAssign, setSelectedVehicleForAssign] =
    useState<string>("");

  const [addVehicleForm, setAddVehicleForm] = useState<AddVehicleFormData>({
    plateNo: "",
    registrationNo: "",
    engineNo: "",
    chassisNo: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    type: "CAR",
    expiresAt: "",
  });

  const [selfAssignForm, setSelfAssignForm] = useState<SelfAssignFormData>({
    vehicleId: "",
    drivingLicenseId: "",
    notes: "",
    validUntil: "",
  });

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchLicenses());
  }, [dispatch]);

  useEffect(() => {
    if (vehiclesError) {
      toast({
        title: "Error",
        description: vehiclesError,
        variant: "destructive",
      });
    }
  }, [vehiclesError, toast]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        addVehicle({
          ...addVehicleForm,
          year: parseInt(addVehicleForm.year),
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      setIsAddVehicleDialogOpen(false);
      setAddVehicleForm({
        plateNo: "",
        registrationNo: "",
        engineNo: "",
        chassisNo: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        type: "CAR",
        expiresAt: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to add vehicle",
        variant: "destructive",
      });
    }
  };

  const handleSelfAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        assignSelfAsDriver({
          vehicleId: selfAssignForm.vehicleId,
          startDate: new Date().toISOString(),
          endDate: selfAssignForm.validUntil || undefined,
          notes: selfAssignForm.notes || undefined,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Assignment request submitted successfully",
      });

      setIsSelfAssignDialogOpen(false);
      setSelfAssignForm({
        vehicleId: "",
        drivingLicenseId: "",
        notes: "",
        validUntil: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  const openSelfAssignDialog = (vehicleId: string) => {
    setSelectedVehicleForAssign(vehicleId);
    setSelfAssignForm((prev) => ({ ...prev, vehicleId }));
    setIsSelfAssignDialogOpen(true);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.engineNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.chassisNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (vehicle: VehicleType) => {
    if (!vehicle.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    const hasActiveAssignment = vehicle.assignments?.some(
      (assignment) => assignment.status === "ACTIVE"
    );

    if (hasActiveAssignment) {
      return <Badge variant="default">Assigned</Badge>;
    }

    return <Badge variant="outline">Available</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage your vehicles and assignments
          </p>
        </div>

        <Dialog
          open={isAddVehicleDialogOpen}
          onOpenChange={setIsAddVehicleDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new vehicle to your account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNo">Plate Number *</Label>
                  <Input
                    id="plateNo"
                    value={addVehicleForm.plateNo}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        plateNo: e.target.value,
                      })
                    }
                    placeholder="e.g., DHK-1234"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration Number</Label>
                  <Input
                    id="registrationNo"
                    value={addVehicleForm.registrationNo}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        registrationNo: e.target.value,
                      })
                    }
                    placeholder="Optional separate registration"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engineNo">Engine Number *</Label>
                  <Input
                    id="engineNo"
                    value={addVehicleForm.engineNo}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        engineNo: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chassisNo">Chassis Number *</Label>
                  <Input
                    id="chassisNo"
                    value={addVehicleForm.chassisNo}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        chassisNo: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={addVehicleForm.brand}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        brand: e.target.value,
                      })
                    }
                    placeholder="e.g., Toyota, Honda"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={addVehicleForm.model}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        model: e.target.value,
                      })
                    }
                    placeholder="e.g., Corolla, Civic"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={addVehicleForm.year}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        year: e.target.value,
                      })
                    }
                    placeholder="2020"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={addVehicleForm.color}
                    onChange={(e) =>
                      setAddVehicleForm({
                        ...addVehicleForm,
                        color: e.target.value,
                      })
                    }
                    placeholder="e.g., Red, Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Select
                    value={addVehicleForm.type}
                    onValueChange={(value: any) =>
                      setAddVehicleForm({ ...addVehicleForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="BICYCLE">Bicycle</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Registration Expiry Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={addVehicleForm.expiresAt}
                  onChange={(e) =>
                    setAddVehicleForm({
                      ...addVehicleForm,
                      expiresAt: e.target.value,
                    })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddVehicleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={vehiclesLoading}>
                  {vehiclesLoading ? "Adding..." : "Add Vehicle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by plate, brand, model, engine or chassis number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehiclesLoading ? (
          <div className="col-span-full text-center py-8">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading vehicles...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Car className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No vehicles found</p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.plateNo}</CardTitle>
                    <CardDescription>
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </CardDescription>
                  </div>
                  {getStatusBadge(vehicle)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Type:</strong> {vehicle.type}
                  </div>
                  {vehicle.color && (
                    <div>
                      <strong>Color:</strong> {vehicle.color}
                    </div>
                  )}
                  <div>
                    <strong>Engine:</strong> {vehicle.engineNo}
                  </div>
                  <div>
                    <strong>Chassis:</strong> {vehicle.chassisNo}
                  </div>
                  {vehicle.registrationNo && (
                    <div>
                      <strong>Reg No:</strong> {vehicle.registrationNo}
                    </div>
                  )}
                </div>

                {vehicle.assignments && vehicle.assignments.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">
                      Current Assignment:
                    </p>
                    {vehicle.assignments
                      .filter((assignment) => assignment.status === "ACTIVE")
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="text-sm text-muted-foreground"
                        >
                          <div>
                            Driver: {assignment.driver?.firstName}{" "}
                            {assignment.driver?.lastName}
                          </div>
                          <div>Status: {assignment.status}</div>
                        </div>
                      ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openSelfAssignDialog(vehicle.id)}
                    disabled={vehicle.assignments?.some(
                      (a) => a.status === "ACTIVE"
                    )}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Assign Self
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Self Assignment Dialog */}
      <Dialog
        open={isSelfAssignDialogOpen}
        onOpenChange={setIsSelfAssignDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Yourself as Driver</DialogTitle>
            <DialogDescription>
              Request to assign yourself as the driver for this vehicle
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSelfAssign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drivingLicenseId">Driving License *</Label>
              <Select
                value={selfAssignForm.drivingLicenseId}
                onValueChange={(value) =>
                  setSelfAssignForm({
                    ...selfAssignForm,
                    drivingLicenseId: value,
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your driving license" />
                </SelectTrigger>
                <SelectContent>
                  {licenses
                    .filter(
                      (license) =>
                        license.status === "ACTIVE" && license.isVerified
                    )
                    .map((license) => (
                      <SelectItem key={license.id} value={license.id}>
                        {license.licenseNo} - {license.category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Assignment Valid Until</Label>
              <Input
                id="validUntil"
                type="datetime-local"
                value={selfAssignForm.validUntil}
                onChange={(e) =>
                  setSelfAssignForm({
                    ...selfAssignForm,
                    validUntil: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={selfAssignForm.notes}
                onChange={(e) =>
                  setSelfAssignForm({
                    ...selfAssignForm,
                    notes: e.target.value,
                  })
                }
                placeholder="Optional notes about the assignment"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSelfAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={vehiclesLoading}>
                {vehiclesLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
