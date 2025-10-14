"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  DollarSign,
  FileText,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ViolationType {
  id: string;
  title: string;
  description: string;
  penalty: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ViolationTypesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ViolationType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    penalty: 0,
    category: "",
  });

  const queryClient = useQueryClient();

  // Mock data for violation types
  const violationTypes: ViolationType[] = [
    {
      id: "1",
      title: "Speeding",
      description: "Exceeding the speed limit",
      penalty: 1000,
      category: "Traffic",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      title: "Signal Violation",
      description: "Running a red light or stop sign",
      penalty: 1500,
      category: "Traffic",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      title: "Wrong Lane",
      description: "Driving in the wrong lane",
      penalty: 800,
      category: "Traffic",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      title: "Parking Violation",
      description: "Illegal parking",
      penalty: 500,
      category: "Parking",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "5",
      title: "No Helmet",
      description: "Riding without helmet",
      penalty: 300,
      category: "Safety",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ];

  const filteredTypes = violationTypes.filter(
    (type) =>
      type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.title || !formData.description || formData.penalty <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Mock create - in real app, this would call an API
    toast.success("Violation type created successfully");
    setIsCreateDialogOpen(false);
    setFormData({ title: "", description: "", penalty: 0, category: "" });
  };

  const handleEdit = (type: ViolationType) => {
    setSelectedType(type);
    setFormData({
      title: type.title,
      description: type.description,
      penalty: type.penalty,
      category: type.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.title || !formData.description || formData.penalty <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Mock update - in real app, this would call an API
    toast.success("Violation type updated successfully");
    setIsEditDialogOpen(false);
    setSelectedType(null);
    setFormData({ title: "", description: "", penalty: 0, category: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this violation type?")) {
      // Mock delete - in real app, this would call an API
      toast.success("Violation type deleted successfully");
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    // Mock toggle - in real app, this would call an API
    toast.success(
      `Violation type ${currentStatus ? "deactivated" : "activated"}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Violation Types</h1>
          <p className="text-muted-foreground">
            Manage traffic violation types and penalties
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Violation Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Violation Type</DialogTitle>
              <DialogDescription>
                Add a new traffic violation type with penalty information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Speeding"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the violation..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penalty">Penalty (৳) *</Label>
                  <Input
                    id="penalty"
                    type="number"
                    value={formData.penalty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        penalty: Number(e.target.value),
                      })
                    }
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Traffic, Parking, Safety"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violationTypes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Types</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {violationTypes.filter((t) => t.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(violationTypes.map((t) => t.category)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Penalty</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳
              {Math.round(
                violationTypes.reduce((sum, t) => sum + t.penalty, 0) /
                  violationTypes.length
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Violation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Violation Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Penalty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <div className="font-medium">{type.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {type.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{type.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ৳{type.penalty.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={type.isActive ? "default" : "secondary"}
                        className={
                          type.isActive
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                        }
                      >
                        {type.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(type)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(type.id, type.isActive)
                          }
                          className={
                            type.isActive
                              ? "text-orange-600 hover:text-orange-700"
                              : "text-green-600 hover:text-green-700"
                          }
                        >
                          {type.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(type.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Violation Type</DialogTitle>
            <DialogDescription>
              Update violation type information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Speeding"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the violation..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-penalty">Penalty (৳) *</Label>
                <Input
                  id="edit-penalty"
                  type="number"
                  value={formData.penalty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      penalty: Number(e.target.value),
                    })
                  }
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Traffic, Parking, Safety"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedType(null);
                  setFormData({
                    title: "",
                    description: "",
                    penalty: 0,
                    category: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
