"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  violationApi,
  Violation,
  CreateViolationData,
} from "@/lib/api/violations";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

export function ViolationManagement() {
  const { user } = useAuth();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Violation | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    vehicleId: "",
    ruleId: "",
    description: "",
    locationId: "",
    evidenceUrl: "",
  });

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const response = await violationApi.getAllViolations();
      if (response.success) {
        setViolations(response.data);
      }
    } catch (error) {
      console.error("Error fetching violations:", error);
      toast.error("Failed to fetch violations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateViolation = async () => {
    try {
      const response = await violationApi.createViolation(formData);
      if (response.success) {
        toast.success("Violation created successfully");
        setIsCreateDialogOpen(false);
        setFormData({
          vehicleId: "",
          ruleId: "",
          description: "",
          locationId: "",
          evidenceUrl: "",
        });
        fetchViolations();
      }
    } catch (error: any) {
      console.error("Error creating violation:", error);
      toast.error(
        error.response?.data?.message || "Failed to create violation"
      );
    }
  };

  const handleUpdateViolation = async () => {
    if (!editingViolation) return;

    try {
      const response = await violationApi.updateViolationStatus(
        editingViolation.id,
        formData
      );
      if (response.success) {
        toast.success("Violation updated successfully");
        setEditingViolation(null);
        setFormData({
          vehicleId: "",
          ruleId: "",
          description: "",
          locationId: "",
          evidenceUrl: "",
        });
        fetchViolations();
      }
    } catch (error: any) {
      console.error("Error updating violation:", error);
      toast.error(
        error.response?.data?.message || "Failed to update violation"
      );
    }
  };

  const handleDeleteViolation = async (violationId: string) => {
    if (!confirm("Are you sure you want to delete this violation?")) return;

    try {
      const response = await violationApi.updateViolationStatus(violationId, {
        status: "RESOLVED",
      });
      if (response.success) {
        toast.success("Violation deleted successfully");
        fetchViolations();
      }
    } catch (error: any) {
      console.error("Error deleting violation:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete violation"
      );
    }
  };

  const handleEditViolation = (violation: Violation) => {
    setEditingViolation(violation);
    setFormData({
      vehicleId: violation.vehicleId,
      ruleId: violation.ruleId,
      description: violation.description,
      location: violation.location,
      fineAmount: violation.fineAmount,
      status: violation.status,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredViolations = violations.filter(
    (violation) =>
      violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading violations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Violation Management</h2>
          <p className="text-muted-foreground">
            Manage traffic violations and fines
          </p>
        </div>
        {user?.role === "POLICE" || user?.role === "ADMIN" ? (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Violation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingViolation ? "Edit Violation" : "Create New Violation"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle ID *</Label>
                  <Input
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                    placeholder="Enter vehicle ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruleId">Rule ID *</Label>
                  <Input
                    id="ruleId"
                    value={formData.ruleId}
                    onChange={(e) =>
                      setFormData({ ...formData, ruleId: e.target.value })
                    }
                    placeholder="Enter rule ID"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the violation"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Dhanmondi, Dhaka"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fineAmount">Fine Amount (BDT) *</Label>
                  <Input
                    id="fineAmount"
                    type="number"
                    value={formData.fineAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fineAmount: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingViolation(null);
                    setFormData({
                      vehicleId: "",
                      ruleId: "",
                      description: "",
                      location: "",
                      fineAmount: 0,
                      status: "PENDING",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingViolation
                      ? handleUpdateViolation
                      : handleCreateViolation
                  }
                >
                  {editingViolation ? "Update Violation" : "Create Violation"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search violations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredViolations.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No violations found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No violations match your search criteria."
                  : "You don't have any violations yet."}
              </p>
            </div>
          ) : (
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
                          <p className="font-medium">{violation.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Vehicle: {violation.vehicleId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{violation.location}</TableCell>
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
                        <span>
                          {new Date(violation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditViolation(violation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteViolation(violation.id)}
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
