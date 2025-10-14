"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { vehicleApi, Vehicle, CreateVehicleData } from "@/lib/api/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Car, User, Calendar } from "lucide-react";
import { toast } from "sonner";

export function VehicleManagement() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateVehicleData>({
    plateNo: "",
    registrationNo: "",
    engineNo: "",
    chassisNo: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    type: "CAR",
    expiresAt: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleApi.getMyVehicles();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async () => {
    try {
      const response = await vehicleApi.addVehicle(formData);
      if (response.success) {
        toast.success("Vehicle added successfully");
        setIsCreateDialogOpen(false);
        setFormData({
          plateNo: "",
          registrationNo: "",
          engineNo: "",
          chassisNo: "",
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          color: "",
          type: "CAR",
          expiresAt: "",
        });
        fetchVehicles();
      }
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to create vehicle");
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;

    try {
      const response = await vehicleApi.updateVehicle(
        editingVehicle.id,
        formData
      );
      if (response.success) {
        toast.success("Vehicle updated successfully");
        setEditingVehicle(null);
        setFormData({
          plateNo: "",
          registrationNo: "",
          engineNo: "",
          chassisNo: "",
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          color: "",
          type: "CAR",
          expiresAt: "",
        });
        fetchVehicles();
      }
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const response = await vehicleApi.deleteVehicle(vehicleId);
      if (response.success) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      }
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plateNo: vehicle.plateNo,
      registrationNo: vehicle.registrationNo || "",
      engineNo: vehicle.engineNo,
      chassisNo: vehicle.chassisNo,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || "",
      type: vehicle.type,
      expiresAt: vehicle.expiresAt || "",
    });
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-muted-foreground">
            Manage your registered vehicles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plateNo">Plate Number *</Label>
                <Input
                  id="plateNo"
                  value={formData.plateNo}
                  onChange={(e) =>
                    setFormData({ ...formData, plateNo: e.target.value })
                  }
                  placeholder="e.g., DHA-1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNo">Registration Number</Label>
                <Input
                  id="registrationNo"
                  value={formData.registrationNo}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationNo: e.target.value })
                  }
                  placeholder="e.g., REG-123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engineNo">Engine Number *</Label>
                <Input
                  id="engineNo"
                  value={formData.engineNo}
                  onChange={(e) =>
                    setFormData({ ...formData, engineNo: e.target.value })
                  }
                  placeholder="Engine number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassisNo">Chassis Number *</Label>
                <Input
                  id="chassisNo"
                  value={formData.chassisNo}
                  onChange={(e) =>
                    setFormData({ ...formData, chassisNo: e.target.value })
                  }
                  placeholder="Chassis number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="e.g., Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="e.g., Corolla"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="e.g., White"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
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
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Registration Expiry</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingVehicle(null);
                  setFormData({
                    plateNo: "",
                    registrationNo: "",
                    engineNo: "",
                    chassisNo: "",
                    brand: "",
                    model: "",
                    year: new Date().getFullYear(),
                    color: "",
                    type: "CAR",
                    expiresAt: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingVehicle ? handleUpdateVehicle : handleCreateVehicle
                }
              >
                {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No vehicles match your search criteria."
                  : "You haven't registered any vehicles yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <div>
                          <p className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.color}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.plateNo}</Badge>
                    </TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicle.isActive ? "default" : "secondary"}
                      >
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
