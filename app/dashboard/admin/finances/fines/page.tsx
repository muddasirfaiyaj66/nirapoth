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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Car,
  MapPin,
  FileText,
  Plus,
  Download,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchFines,
  fetchFineStats,
  fetchOverdueFines,
  createFine,
  updateFine,
  deleteFine,
  setFilters,
  clearFilters,
  setPagination,
} from "@/lib/store/slices/fineSlice";
import { toast } from "sonner";
import { Fine, CreateFineData, UpdateFineData } from "@/lib/api/fines";

export default function AdminFinesPage() {
  const dispatch = useAppDispatch();
  const {
    fines = [],
    stats,
    overdueFines = [],
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.fine);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vehiclePlateFilter, setVehiclePlateFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFine, setEditingFine] = useState<Fine | null>(null);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchFineStats());
    dispatch(fetchOverdueFines());
    loadFines();
  }, []);

  // Load fines when filters change
  useEffect(() => {
    if (pagination) {
      loadFines();
    }
  }, [filters, pagination?.page]);

  const loadFines = () => {
    if (!pagination) return;

    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    };
    dispatch(fetchFines(params));
  };

  const handleSearch = () => {
    dispatch(
      setFilters({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        vehiclePlate: vehiclePlateFilter || undefined,
        dateFrom: dateFromFilter || undefined,
        dateTo: dateToFilter || undefined,
      })
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVehiclePlateFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    dispatch(clearFilters());
  };

  const handleCreateFine = async (data: CreateFineData) => {
    try {
      await dispatch(createFine(data)).unwrap();
      toast.success("Fine created successfully");
      setIsCreateDialogOpen(false);
      loadFines();
    } catch (error: any) {
      toast.error(error || "Failed to create fine");
    }
  };

  const handleUpdateFine = async (fineId: string, data: UpdateFineData) => {
    try {
      await dispatch(updateFine({ fineId, data })).unwrap();
      toast.success("Fine updated successfully");
      setIsEditDialogOpen(false);
      setEditingFine(null);
      loadFines();
    } catch (error: any) {
      toast.error(error || "Failed to update fine");
    }
  };

  const handleDeleteFine = async (fineId: string) => {
    try {
      await dispatch(deleteFine(fineId)).unwrap();
      toast.success("Fine deleted successfully");
      loadFines();
    } catch (error: any) {
      toast.error(error || "Failed to delete fine");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "UNPAID":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "CANCELLED":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "DISPUTED":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return CheckCircle;
      case "UNPAID":
        return XCircle;
      case "CANCELLED":
        return XCircle;
      case "DISPUTED":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Fines Management
          </h1>
          <p className="text-muted-foreground">
            Manage traffic violation fines and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => loadFines()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Fine
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFines}</div>
              <p className="text-xs text-muted-foreground">
                Total amount: {formatCurrency(stats.totalAmount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.unpaidFines}
              </div>
              <p className="text-xs text-muted-foreground">
                Amount: {formatCurrency(stats.unpaidAmount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.paidFines}
              </div>
              <p className="text-xs text-muted-foreground">
                Amount: {formatCurrency(stats.paidAmount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {overdueFines.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Fines past due date
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fines by rule, vehicle, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="DISPUTED">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Vehicle plate number"
              value={vehiclePlateFilter}
              onChange={(e) => setVehiclePlateFilter(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              type="date"
              placeholder="From date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fines</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fine ID</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fines.map((fine) => {
                    const StatusIcon = getStatusIcon(fine.status);
                    const isOverdueFine = isOverdue(fine.dueDate);

                    return (
                      <TableRow key={fine.id}>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {fine.id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {fine.violation?.rule?.title || "Unknown Rule"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {fine.violation?.rule?.description ||
                                "No description"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {fine.violation?.vehicle && (
                            <div className="flex items-center gap-1">
                              <Car className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {fine.violation.vehicle.plateNo}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {fine.violation.vehicle.brand}{" "}
                                  {fine.violation.vehicle.model}
                                </div>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {fine.violation?.vehicle?.owner && (
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {fine.violation.vehicle.owner.firstName}{" "}
                                {fine.violation.vehicle.owner.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {fine.violation.vehicle.owner.email}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(fine.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusBadgeColor(
                              fine.status
                            )} flex items-center gap-1 w-fit`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {fine.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {fine.dueDate ? (
                            <div
                              className={`flex items-center gap-1 ${
                                isOverdueFine ? "text-red-600" : ""
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              <span className="text-sm">
                                {formatDate(fine.dueDate)}
                                {isOverdueFine && " (Overdue)"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              No due date
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(fine.issuedAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFine(fine);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingFine(fine);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Fine
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteFine(fine.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Fine
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} fines
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(setPagination({ page: pagination.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch(setPagination({ page: pagination.page + 1 }))
              }
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Fine Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Fine Details</DialogTitle>
            <DialogDescription>
              Complete information about the fine
            </DialogDescription>
          </DialogHeader>
          {selectedFine && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Fine Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fine ID:</span>{" "}
                      {selectedFine.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>{" "}
                      {formatCurrency(selectedFine.amount)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(selectedFine.status)}
                      >
                        {selectedFine.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issued:</span>{" "}
                      {formatDate(selectedFine.issuedAt)}
                    </div>
                    {selectedFine.dueDate && (
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>{" "}
                        {formatDate(selectedFine.dueDate)}
                        {isOverdue(selectedFine.dueDate) && (
                          <span className="text-red-600 ml-2">(Overdue)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Violation Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rule:</span>{" "}
                      {selectedFine.violation?.rule?.title || "Unknown"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>{" "}
                      {selectedFine.violation?.rule?.description ||
                        "No description"}
                    </div>
                    {selectedFine.violation?.vehicle && (
                      <>
                        <div>
                          <span className="text-muted-foreground">
                            Vehicle:
                          </span>{" "}
                          {selectedFine.violation.vehicle.plateNo}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span>{" "}
                          {selectedFine.violation.vehicle.brand}{" "}
                          {selectedFine.violation.vehicle.model}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              {selectedFine.violation?.vehicle?.owner && (
                <div>
                  <h4 className="font-medium mb-3">Owner Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {selectedFine.violation.vehicle.owner.firstName}{" "}
                      {selectedFine.violation.vehicle.owner.lastName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedFine.violation.vehicle.owner.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {selectedFine.violation.vehicle.owner.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment History */}
              {selectedFine.payments && selectedFine.payments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Payment History</h4>
                  <div className="space-y-2">
                    {selectedFine.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.paymentMethod} - {payment.paymentStatus}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.paidAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Fine Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Fine</DialogTitle>
            <DialogDescription>
              Create a new fine for a violation
            </DialogDescription>
          </DialogHeader>
          <CreateFineForm
            onSubmit={handleCreateFine}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Fine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fine</DialogTitle>
            <DialogDescription>Update fine information</DialogDescription>
          </DialogHeader>
          {editingFine && (
            <EditFineForm
              fine={editingFine}
              onSubmit={(data) => handleUpdateFine(editingFine.id, data)}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingFine(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Fine Form Component
function CreateFineForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: CreateFineData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<CreateFineData>({
    violationId: "",
    amount: 0,
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Violation ID</label>
        <Input
          value={formData.violationId}
          onChange={(e) =>
            setFormData({ ...formData, violationId: e.target.value })
          }
          placeholder="Enter violation ID"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Amount (BDT)</label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: Number(e.target.value) })
          }
          placeholder="Enter fine amount"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Fine</Button>
      </div>
    </form>
  );
}

// Edit Fine Form Component
function EditFineForm({
  fine,
  onSubmit,
  onCancel,
}: {
  fine: Fine;
  onSubmit: (data: UpdateFineData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<UpdateFineData>({
    amount: fine.amount,
    status: fine.status,
    dueDate: fine.dueDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Amount (BDT)</label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: Number(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="DISPUTED">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Fine</Button>
      </div>
    </form>
  );
}
