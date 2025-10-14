"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { violationApi } from "@/lib/api/violations";
import { useAppSelector } from "@/lib/store";

interface ViolationType {
  id: string;
  code: string;
  title: string;
  description: string;
  penalty: number | null;
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
    code: "",
    title: "",
    description: "",
    penalty: 0,
  });
  const [loading, setLoading] = useState(true);
  const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);

  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  // Debug: Log current user role
  useEffect(() => {
    if (user) {
      console.log("Current user role:", user.role);
    }
  }, [user]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await violationApi.getAllRules();
      if (response.success) {
        setViolationTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast.error("Failed to fetch violation types");
    } finally {
      setLoading(false);
    }
  };

  const filteredTypes = violationTypes.filter(
    (type) =>
      type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.code || !formData.title || !formData.description) {
      toast.error(
        "Please fill in all required fields (code, title, description)"
      );
      return;
    }

    try {
      const response = await violationApi.createRule(formData);
      if (response.success) {
        toast.success("Violation type created successfully");
        setIsCreateDialogOpen(false);
        setFormData({ code: "", title: "", description: "", penalty: 0 });
        fetchRules(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error creating rule:", error);
      toast.error(
        error.response?.data?.message || "Failed to create violation type"
      );
    }
  };

  const handleEdit = (type: ViolationType) => {
    setSelectedType(type);
    setFormData({
      code: type.code,
      title: type.title,
      description: type.description,
      penalty: type.penalty || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedType || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await violationApi.updateRule(selectedType.id, {
        title: formData.title,
        description: formData.description,
        penalty: formData.penalty || undefined,
      });

      if (response.success) {
        toast.success("Violation type updated successfully");
        setIsEditDialogOpen(false);
        setSelectedType(null);
        setFormData({ code: "", title: "", description: "", penalty: 0 });
        fetchRules(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error updating rule:", error);
      toast.error(
        error.response?.data?.message || "Failed to update violation type"
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      try {
        const response = await violationApi.deleteRule(id);
        if (response.success) {
          toast.success("Violation type deleted successfully");
          fetchRules(); // Refresh the list
        }
      } catch (error: any) {
        console.error("Error deleting rule:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete violation type"
        );
      }
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    title: string
  ) => {
    try {
      const response = await violationApi.updateRule(id, {
        isActive: !currentStatus,
      });

      if (response.success) {
        toast.success(
          `"${title}" has been ${currentStatus ? "deactivated" : "activated"}`
        );
        fetchRules(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
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
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g., VT-001"
                />
              </div>
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
              <div>
                <Label htmlFor="penalty">Penalty (৳)</Label>
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
            <CardTitle className="text-sm font-medium">Unique Codes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(violationTypes.map((t) => t.code)).size}
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
                violationTypes.reduce((sum, t) => sum + (t.penalty || 0), 0) /
                  (violationTypes.length || 1)
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No violation types found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Penalty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{type.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{type.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {type.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ৳{(type.penalty || 0).toLocaleString()}
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
                              handleToggleStatus(
                                type.id,
                                type.isActive,
                                type.title
                              )
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
                            onClick={() => handleDelete(type.id, type.title)}
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
          )}
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
              <Label htmlFor="edit-code">Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., VT-001"
                disabled
              />
            </div>
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
            <div>
              <Label htmlFor="edit-penalty">Penalty (৳)</Label>
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedType(null);
                  setFormData({
                    code: "",
                    title: "",
                    description: "",
                    penalty: 0,
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
