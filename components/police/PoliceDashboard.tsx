"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { violationApi, complaintApi, paymentApi } from "@/lib/api";
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
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Shield,
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
} from "lucide-react";
import { toast } from "sonner";

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

export function PoliceDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [violations, setViolations] = useState<Violation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>({});

  // Dialog states
  const [isCreateViolationDialogOpen, setIsCreateViolationDialogOpen] =
    useState(false);
  const [isUpdateComplaintDialogOpen, setIsUpdateComplaintDialogOpen] =
    useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    null
  );

  // Form states
  const [violationFormData, setViolationFormData] = useState({
    vehicleId: "",
    ruleId: "",
    description: "",
    location: "",
    fineAmount: 0,
    status: "PENDING",
  });

  const [complaintFormData, setComplaintFormData] = useState({
    status: "PENDING",
    priority: "MEDIUM",
  });

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        violationsRes,
        complaintsRes,
        paymentsRes,
        violationStatsRes,
        complaintStatsRes,
        paymentStatsRes,
      ] = await Promise.all([
        violationApi.getAllViolations(),
        complaintApi.getAllComplaints(),
        paymentApi.getAllPayments(),
        violationApi.getViolationStats(),
        complaintApi.getComplaintStats(),
        paymentApi.getPaymentStats(),
      ]);

      if (violationsRes.success) setViolations(violationsRes.data);
      if (complaintsRes.success) setComplaints(complaintsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);

      // Combine stats
      setStats({
        totalViolations: violationStatsRes.success
          ? violationStatsRes.data.totalViolations
          : 0,
        totalComplaints: complaintStatsRes.success
          ? complaintStatsRes.data.totalComplaints
          : 0,
        totalPayments: paymentStatsRes.success
          ? paymentStatsRes.data.totalPayments
          : 0,
        totalRevenue: paymentStatsRes.success
          ? paymentStatsRes.data.totalRevenue
          : 0,
      });
    } catch (error) {
      console.error("Error fetching police data:", error);
      toast.error("Failed to fetch police data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateViolation = async () => {
    try {
      const response = await violationApi.createViolation(violationFormData);
      if (response.success) {
        toast.success("Violation created successfully");
        setIsCreateViolationDialogOpen(false);
        setViolationFormData({
          vehicleId: "",
          ruleId: "",
          description: "",
          location: "",
          fineAmount: 0,
          status: "PENDING",
        });
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error creating violation:", error);
      toast.error(
        error.response?.data?.message || "Failed to create violation"
      );
    }
  };

  const handleUpdateComplaint = async () => {
    if (!editingComplaint) return;

    try {
      const response = await complaintApi.updateComplaint(
        editingComplaint.id,
        complaintFormData
      );
      if (response.success) {
        toast.success("Complaint updated successfully");
        setIsUpdateComplaintDialogOpen(false);
        setEditingComplaint(null);
        setComplaintFormData({
          status: "PENDING",
          priority: "MEDIUM",
        });
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error updating complaint:", error);
      toast.error(
        error.response?.data?.message || "Failed to update complaint"
      );
    }
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setComplaintFormData({
      status: complaint.status,
      priority: complaint.priority,
    });
    setIsUpdateComplaintDialogOpen(true);
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
            Loading police dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Police Dashboard</h2>
          <p className="text-muted-foreground">
            Traffic management and enforcement
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
            <CardTitle className="text-sm font-medium">
              Total Violations
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViolations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Complaints
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalComplaints || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue || 0} BDT
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from last month
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

        <TabsContent value="violations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Violation Management</h3>
            <Dialog
              open={isCreateViolationDialogOpen}
              onOpenChange={setIsCreateViolationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Violation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Violation</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehicle ID *</Label>
                    <Input
                      id="vehicleId"
                      value={violationFormData.vehicleId}
                      onChange={(e) =>
                        setViolationFormData({
                          ...violationFormData,
                          vehicleId: e.target.value,
                        })
                      }
                      placeholder="Enter vehicle ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleId">Rule ID *</Label>
                    <Input
                      id="ruleId"
                      value={violationFormData.ruleId}
                      onChange={(e) =>
                        setViolationFormData({
                          ...violationFormData,
                          ruleId: e.target.value,
                        })
                      }
                      placeholder="Enter rule ID"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={violationFormData.description}
                      onChange={(e) =>
                        setViolationFormData({
                          ...violationFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the violation"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={violationFormData.location}
                      onChange={(e) =>
                        setViolationFormData({
                          ...violationFormData,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Dhanmondi, Dhaka"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fineAmount">Fine Amount (BDT) *</Label>
                    <Input
                      id="fineAmount"
                      type="number"
                      value={violationFormData.fineAmount}
                      onChange={(e) =>
                        setViolationFormData({
                          ...violationFormData,
                          fineAmount: parseFloat(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={violationFormData.status}
                      onValueChange={(value) =>
                        setViolationFormData({
                          ...violationFormData,
                          status: value,
                        })
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
                    onClick={() => setIsCreateViolationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateViolation}>
                    Create Violation
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
                  placeholder="Search violations..."
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
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="complaints" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Complaint Management</h3>
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
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComplaint(complaint)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
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

      {/* Update Complaint Dialog */}
      <Dialog
        open={isUpdateComplaintDialogOpen}
        onOpenChange={setIsUpdateComplaintDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={complaintFormData.status}
                onValueChange={(value) =>
                  setComplaintFormData({ ...complaintFormData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
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
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsUpdateComplaintDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateComplaint}>Update Complaint</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
