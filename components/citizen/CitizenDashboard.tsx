"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { vehicleApi, violationApi, complaintApi, paymentApi } from "@/lib/api";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Car,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useComprehensiveRefresh } from "@/hooks/useAutoRefresh";

interface Vehicle {
  id: string;
  plateNo: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface Violation {
  id: string;
  description: string;
  fineAmount: number;
  status: string;
  location: string;
  createdAt: string;
  vehicleId: string;
}

interface Complaint {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  location: string;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
}

export function CitizenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>({});

  // Dialog states
  const [isCreateVehicleDialogOpen, setIsCreateVehicleDialogOpen] =
    useState(false);
  const [isCreateComplaintDialogOpen, setIsCreateComplaintDialogOpen] =
    useState(false);
  const [isCreatePaymentDialogOpen, setIsCreatePaymentDialogOpen] =
    useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [vehicleFormData, setVehicleFormData] = useState({
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

  const [complaintFormData, setComplaintFormData] = useState({
    type: "TRAFFIC_VIOLATION",
    title: "",
    description: "",
    location: "",
    priority: "MEDIUM",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    fineId: "",
    amount: 0,
    method: "BANK_TRANSFER",
    transactionId: "",
  });

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, violationsRes, complaintsRes, paymentsRes] =
        await Promise.all([
          vehicleApi.getMyVehicles(),
          violationApi.getMyViolations(),
          complaintApi.getMyComplaints(),
          paymentApi.getMyPayments(),
        ]);

      if (vehiclesRes.success) setVehicles(vehiclesRes.data);
      if (violationsRes.success) setViolations(violationsRes.data);
      if (complaintsRes.success) setComplaints(complaintsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);

      // Calculate stats
      setStats({
        totalVehicles: vehiclesRes.success ? vehiclesRes.data.length : 0,
        totalViolations: violationsRes.success ? violationsRes.data.length : 0,
        totalComplaints: complaintsRes.success ? complaintsRes.data.length : 0,
        totalPayments: paymentsRes.success ? paymentsRes.data.length : 0,
        totalFines: violationsRes.success
          ? violationsRes.data.reduce((sum, v) => sum + v.fineAmount, 0)
          : 0,
      });
    } catch (error) {
      console.error("Error fetching citizen data:", error);
      toast.error("Failed to fetch citizen data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds + on focus/visibility
  useComprehensiveRefresh({
    enabled: true,
    interval: 30000, // 30 seconds
    onRefresh: fetchAllData,
  });

  const handleCreateVehicle = async () => {
    try {
      const response = await vehicleApi.registerVehicle(vehicleFormData);
      if (response.success) {
        toast.success("Vehicle added successfully");
        setIsCreateVehicleDialogOpen(false);
        setVehicleFormData({
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
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to add vehicle");
    }
  };

  const handleCreateComplaint = async () => {
    try {
      const response = await complaintApi.createComplaint(complaintFormData);
      if (response.success) {
        toast.success("Complaint submitted successfully");
        setIsCreateComplaintDialogOpen(false);
        setComplaintFormData({
          type: "TRAFFIC_VIOLATION",
          title: "",
          description: "",
          location: "",
          priority: "MEDIUM",
        });
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error creating complaint:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    }
  };

  const handleCreatePayment = async () => {
    try {
      const response = await paymentApi.createPayment(paymentFormData);
      if (response.success) {
        toast.success("Payment created successfully");
        setIsCreatePaymentDialogOpen(false);
        setPaymentFormData({
          fineId: "",
          amount: 0,
          method: "BANK_TRANSFER",
          transactionId: "",
        });
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast.error(error.response?.data?.message || "Failed to create payment");
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;

    try {
      const response = await vehicleApi.updateVehicle(
        editingVehicle.id,
        vehicleFormData
      );
      if (response.success) {
        toast.success("Vehicle updated successfully");
        setEditingVehicle(null);
        setVehicleFormData({
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
        fetchAllData();
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
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleFormData({
      plateNo: vehicle.plateNo,
      registrationNo: "",
      engineNo: "",
      chassisNo: "",
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: "",
      type: vehicle.type,
      expiresAt: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
      case "RESOLVED":
      case "PAID":
        return "bg-green-100 text-green-800";
      case "FAILED":
      case "REJECTED":
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "URGENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredViolations = violations.filter(
    (violation) =>
      violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading citizen dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Citizen Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your vehicles, violations, and complaints
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchAllData} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Registered vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViolations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              Traffic violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalComplaints || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Submitted complaints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalFines || 0} BDT
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Outstanding fines
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {violations.slice(0, 5).map((violation) => (
                    <div
                      key={violation.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{violation.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {violation.fineAmount} BDT
                        </p>
                      </div>
                      <Badge className={getStatusColor(violation.status)}>
                        {violation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complaints.slice(0, 5).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.type}
                        </p>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vehicle Management</h3>
            <Dialog
              open={isCreateVehicleDialogOpen}
              onOpenChange={setIsCreateVehicleDialogOpen}
            >
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
                      value={vehicleFormData.plateNo}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          plateNo: e.target.value,
                        })
                      }
                      placeholder="e.g., DHA-1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNo">Registration Number</Label>
                    <Input
                      id="registrationNo"
                      value={vehicleFormData.registrationNo}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          registrationNo: e.target.value,
                        })
                      }
                      placeholder="e.g., REG-123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineNo">Engine Number *</Label>
                    <Input
                      id="engineNo"
                      value={vehicleFormData.engineNo}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          engineNo: e.target.value,
                        })
                      }
                      placeholder="Engine number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassisNo">Chassis Number *</Label>
                    <Input
                      id="chassisNo"
                      value={vehicleFormData.chassisNo}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          chassisNo: e.target.value,
                        })
                      }
                      placeholder="Chassis number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={vehicleFormData.brand}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          brand: e.target.value,
                        })
                      }
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={vehicleFormData.model}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          model: e.target.value,
                        })
                      }
                      placeholder="e.g., Corolla"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={vehicleFormData.year}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          year: parseInt(e.target.value),
                        })
                      }
                      placeholder="2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={vehicleFormData.color}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          color: e.target.value,
                        })
                      }
                      placeholder="e.g., White"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Vehicle Type *</Label>
                    <Select
                      value={vehicleFormData.type}
                      onValueChange={(value) =>
                        setVehicleFormData({ ...vehicleFormData, type: value })
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
                      value={vehicleFormData.expiresAt}
                      onChange={(e) =>
                        setVehicleFormData({
                          ...vehicleFormData,
                          expiresAt: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateVehicleDialogOpen(false);
                      setEditingVehicle(null);
                      setVehicleFormData({
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredViolations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="font-medium">
                              {violation.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Vehicle: {violation.vehicleId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{violation.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">
                            {violation.fineAmount.toLocaleString()} BDT
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(violation.status)}>
                          {violation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(violation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Complaint Management</h3>
            <Dialog
              open={isCreateComplaintDialogOpen}
              onOpenChange={setIsCreateComplaintDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Complaint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit New Complaint</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Complaint Type *</Label>
                    <Select
                      value={complaintFormData.type}
                      onValueChange={(value) =>
                        setComplaintFormData({
                          ...complaintFormData,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRAFFIC_VIOLATION">
                          Traffic Violation
                        </SelectItem>
                        <SelectItem value="ROAD_CONDITION">
                          Road Condition
                        </SelectItem>
                        <SelectItem value="ACCIDENT">Accident</SelectItem>
                        <SelectItem value="NOISE_POLLUTION">
                          Noise Pollution
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={complaintFormData.priority}
                      onValueChange={(value) =>
                        setComplaintFormData({
                          ...complaintFormData,
                          priority: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={complaintFormData.title}
                      onChange={(e) =>
                        setComplaintFormData({
                          ...complaintFormData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Brief description of the complaint"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={complaintFormData.description}
                      onChange={(e) =>
                        setComplaintFormData({
                          ...complaintFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Detailed description of the complaint"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={complaintFormData.location}
                      onChange={(e) =>
                        setComplaintFormData({
                          ...complaintFormData,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Dhanmondi, Dhaka"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateComplaintDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateComplaint}>
                    Submit Complaint
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
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="font-medium">{complaint.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {complaint.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {complaint.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{complaint.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Management</h3>
            <Dialog
              open={isCreatePaymentDialogOpen}
              onOpenChange={setIsCreatePaymentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Make New Payment</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fineId">Fine ID *</Label>
                    <Input
                      id="fineId"
                      value={paymentFormData.fineId}
                      onChange={(e) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          fineId: e.target.value,
                        })
                      }
                      placeholder="Enter fine ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (BDT) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={paymentFormData.amount}
                      onChange={(e) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method *</Label>
                    <Select
                      value={paymentFormData.method}
                      onValueChange={(value) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          method: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="MOBILE_BANKING">
                          Mobile Banking
                        </SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      value={paymentFormData.transactionId}
                      onChange={(e) =>
                        setPaymentFormData({
                          ...paymentFormData,
                          transactionId: e.target.value,
                        })
                      }
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatePaymentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePayment}>Make Payment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.transactionId || "N/A"}</TableCell>
                      <TableCell>{payment.amount} BDT</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
