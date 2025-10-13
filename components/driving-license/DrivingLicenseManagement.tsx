"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchLicenses,
  applyForLicense,
  renewLicense,
  DrivingLicense as ReduxDrivingLicense,
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
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
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

interface AddLicenseFormData {
  licenseNo: string;
  category:
    | "LIGHT_VEHICLE"
    | "MOTORCYCLE"
    | "LIGHT_VEHICLE_MOTORCYCLE"
    | "HEAVY_VEHICLE"
    | "PSV"
    | "GOODS_VEHICLE";
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
}

export function DrivingLicenseManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    licenses,
    isLoading: loading,
    error,
  } = useSelector((state: RootState) => state.licenses);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AddLicenseFormData>({
    licenseNo: "",
    category: "LIGHT_VEHICLE",
    issueDate: "",
    expiryDate: "",
    issuingAuthority: "BRTA",
  });

  useEffect(() => {
    dispatch(fetchLicenses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAddLicense = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        applyForLicense({
          category: formData.category,
          isRenewal: false,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "License application submitted successfully",
      });
      setIsAddDialogOpen(false);
      setFormData({
        licenseNo: "",
        category: "LIGHT_VEHICLE",
        issueDate: "",
        expiryDate: "",
        issuingAuthority: "BRTA",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to add license",
        variant: "destructive",
      });
    }
  };

  const handleRenewLicense = async (licenseId: string) => {
    try {
      await dispatch(renewLicense(licenseId)).unwrap();

      toast({
        title: "Success",
        description: "License renewal submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to renew license",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (license: ReduxDrivingLicense) => {
    if (license.status === "SUSPENDED") {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (
      license.status === "EXPIRED" ||
      new Date(license.expiryDate) < new Date()
    ) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (license.status === "REVOKED") {
      return <Badge variant="secondary">Revoked</Badge>;
    }
    if (license.status === "ACTIVE" && license.isVerified) {
      return <Badge variant="default">Verified</Badge>;
    }
    return <Badge variant="outline">Pending Verification</Badge>;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      return { icon: XCircle, color: "text-red-500", text: "Expired" };
    } else if (daysUntilExpiry <= 30) {
      return {
        icon: AlertTriangle,
        color: "text-yellow-500",
        text: `Expires in ${daysUntilExpiry} days`,
      };
    } else {
      return { icon: CheckCircle, color: "text-green-500", text: "Valid" };
    }
  };

  const filteredLicenses = licenses.filter(
    (license) =>
      license.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (license.issuingAuthority &&
        license.issuingAuthority
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Driving Licenses</h1>
          <p className="text-muted-foreground">
            Manage your driving licenses and vehicle permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddLicense}>
              <DialogHeader>
                <DialogTitle>Add New Driving License</DialogTitle>
                <DialogDescription>
                  Enter your driving license details. All fields are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNo">License Number</Label>
                  <Input
                    id="licenseNo"
                    value={formData.licenseNo}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseNo: e.target.value })
                    }
                    placeholder="Enter license number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select license category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="HEAVY_VEHICLE">
                        Heavy Vehicle
                      </SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="LEARNER">Learner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                  <Input
                    id="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issuingAuthority: e.target.value,
                      })
                    }
                    placeholder="e.g., BRTA, District Transport Office"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add License</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search licenses by number, category, or issuing authority..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{licenses.length}</div>
            <p className="text-xs text-muted-foreground">Total Licenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {
                licenses.filter(
                  (l) =>
                    l.status === "ACTIVE" && new Date(l.expiryDate) > new Date()
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Active Licenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {
                licenses.filter((l) => {
                  const daysUntilExpiry = Math.ceil(
                    (new Date(l.expiryDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {licenses.filter((l) => l.violationCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">With Violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses List */}
      <div className="grid gap-4">
        {filteredLicenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No driving licenses found</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                Add Your First License
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLicenses.map((license) => {
            const expiryStatus = getExpiryStatus(license.expiryDate);
            const ExpiryIcon = expiryStatus.icon;

            return (
              <Card key={license.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {license.licenseNo}
                        {getStatusBadge(license)}
                      </CardTitle>
                      <CardDescription>
                        {license.category.replace("_", " ")} •{" "}
                        {license.issuingAuthority}
                      </CardDescription>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${expiryStatus.color}`}
                    >
                      <ExpiryIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {expiryStatus.text}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Issue Date
                      </p>
                      <p>{new Date(license.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Expiry Date
                      </p>
                      <p>{new Date(license.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Violations
                      </p>
                      <p
                        className={
                          license.violationCount > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {license.violationCount} violations
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Status
                      </p>
                      <p
                        className={
                          license.isVerified
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {license.isVerified ? "Verified" : "Pending"}
                      </p>
                    </div>
                  </div>

                  {license.restrictions && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Restrictions:</strong> {license.restrictions}
                      </AlertDescription>
                    </Alert>
                  )}

                  {license.status === "SUSPENDED" && (
                    <Alert variant="destructive" className="mt-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>License is suspended</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
