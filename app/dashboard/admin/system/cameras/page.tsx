"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Camera,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Wifi,
  WifiOff,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Video,
  Monitor,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CameraApiService,
  Camera as CameraData,
  Location,
  PoliceStation,
  CameraStats,
} from "@/lib/api/camera.api";

export default function CameraManagementPage() {
  const { toast } = useToast();

  // State
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [stats, setStats] = useState<CameraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [isStreamDialogOpen, setIsStreamDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    streamUrl: "",
    status: "ACTIVE" as CameraData["status"],
    locationId: "",
    stationId: "",
  });

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [camerasData, locationsData, stationsData, statsData] =
          await Promise.all([
            CameraApiService.getCameras(),
            CameraApiService.getLocations(),
            CameraApiService.getPoliceStations(),
            CameraApiService.getCameraStats(),
          ]);

        setCameras(camerasData);
        setLocations(locationsData);
        setStations(stationsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading camera data:", error);
        toast({
          title: "Error",
          description: "Failed to load camera data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Helper function to get location display name
  const getLocationName = (location: CameraData["location"]): string => {
    if (!location) return "No location";
    return (
      location.address ||
      location.city ||
      location.district ||
      "Unknown location"
    );
  };

  // Filter cameras
  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch =
      camera.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocationName(camera.location)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      camera.station?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || camera.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: CameraData["status"] }) => {
    const variants = {
      ACTIVE: {
        variant: "default" as const,
        color: "bg-green-500",
        icon: CheckCircle,
      },
      INACTIVE: {
        variant: "secondary" as const,
        color: "bg-gray-500",
        icon: XCircle,
      },
      MAINTENANCE: {
        variant: "outline" as const,
        color: "bg-yellow-500",
        icon: Clock,
      },
      OFFLINE: {
        variant: "destructive" as const,
        color: "bg-red-500",
        icon: AlertTriangle,
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCamera) {
      // Edit existing camera
      setCameras((prev) =>
        prev.map((camera) =>
          camera.id === selectedCamera.id
            ? {
                ...camera,
                ...formData,
                location:
                  locations.find((loc) => loc.id === formData.locationId) ||
                  null,
                station:
                  stations.find(
                    (station) => station.id === formData.stationId
                  ) || null,
                updatedAt: new Date().toISOString(),
              }
            : camera
        )
      );
      toast({
        title: "Camera Updated",
        description: "Camera information has been updated successfully.",
      });
      setIsEditDialogOpen(false);
    } else {
      // Add new camera
      const newCamera: CameraData = {
        id: Date.now().toString(),
        name: formData.name,
        streamUrl: formData.streamUrl,
        status: formData.status,
        locationId: formData.locationId || null,
        location:
          locations.find((loc) => loc.id === formData.locationId) || null,
        stationId: formData.stationId || null,
        station:
          stations.find((station) => station.id === formData.stationId) || null,
        fireServiceId: null,
        installedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCameras((prev) => [...prev, newCamera]);
      toast({
        title: "Camera Added",
        description: "New camera has been added successfully.",
      });
      setIsAddDialogOpen(false);
    }

    // Reset form
    setFormData({
      name: "",
      streamUrl: "",
      status: "ACTIVE",
      locationId: "",
      stationId: "",
    });
    setSelectedCamera(null);
  };

  // Handle delete
  const handleDelete = (cameraId: string) => {
    setCameras((prev) => prev.filter((camera) => camera.id !== cameraId));
    toast({
      title: "Camera Deleted",
      description: "Camera has been removed from the system.",
      variant: "destructive",
    });
  };

  // Handle edit
  const handleEdit = (camera: CameraData) => {
    setSelectedCamera(camera);
    setFormData({
      name: camera.name || "",
      streamUrl: camera.streamUrl,
      status: camera.status,
      locationId: camera.locationId || "",
      stationId: camera.stationId || "",
    });
    setIsEditDialogOpen(true);
  };

  // Camera form component
  const CameraForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Camera Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter camera name"
          required
        />
      </div>

      <div>
        <Label htmlFor="streamUrl">Stream URL</Label>
        <Input
          id="streamUrl"
          value={formData.streamUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, streamUrl: e.target.value }))
          }
          placeholder="rtmp://localhost:1935/live/camera1"
          required
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: CameraData["status"]) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          value={formData.locationId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, locationId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {getLocationName(location)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="station">Police Station</Label>
        <Select
          value={formData.stationId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, stationId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select police station" />
          </SelectTrigger>
          <SelectContent>
            {stations.map((station) => (
              <SelectItem key={station.id} value={station.id}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="submit">
          {selectedCamera ? "Update Camera" : "Add Camera"}
        </Button>
      </DialogFooter>
    </form>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Statistics
  const cameraStats = {
    total: cameras.length,
    active: cameras.filter((c) => c.status === "ACTIVE").length,
    offline: cameras.filter((c) => c.status === "OFFLINE").length,
    maintenance: cameras.filter((c) => c.status === "MAINTENANCE").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Camera className="h-8 w-8" />
            Camera Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage traffic surveillance cameras
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Camera</DialogTitle>
                <DialogDescription>
                  Configure a new surveillance camera for the traffic management
                  system.
                </DialogDescription>
              </DialogHeader>
              <CameraForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cameras</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cameraStats.total}</div>
            <p className="text-xs text-muted-foreground">System-wide cameras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cameraStats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cameraStats.offline}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {cameraStats.maintenance}
            </div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search cameras, locations, or stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera List */}
      <Card>
        <CardHeader>
          <CardTitle>Cameras ({filteredCameras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCameras.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No cameras found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Camera</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Installed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCameras.map((camera) => (
                    <TableRow key={camera.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {camera.name || "Unnamed Camera"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {camera.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={camera.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{getLocationName(camera.location)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {camera.station?.name || "No station"}
                      </TableCell>
                      <TableCell>
                        {new Date(camera.installedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCamera(camera);
                              setIsStreamDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(camera)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(camera.id)}
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
            <DialogTitle>Edit Camera</DialogTitle>
            <DialogDescription>
              Update camera information and settings.
            </DialogDescription>
          </DialogHeader>
          <CameraForm />
        </DialogContent>
      </Dialog>

      {/* Stream Preview Dialog */}
      <Dialog open={isStreamDialogOpen} onOpenChange={setIsStreamDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              {selectedCamera?.name || "Camera Stream"}
            </DialogTitle>
            <DialogDescription>Live camera feed preview</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Camera Stream Preview</p>
                <p className="text-sm opacity-75">
                  Stream URL: {selectedCamera?.streamUrl}
                </p>
                <p className="text-xs opacity-50 mt-2">
                  In a real implementation, this would show the live video feed
                </p>
              </div>
            </div>

            {selectedCamera && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={selectedCamera.status} />
                </div>
                <div>
                  <strong>Location:</strong>{" "}
                  {getLocationName(selectedCamera.location)}
                </div>
                <div>
                  <strong>Station:</strong>{" "}
                  {selectedCamera.station?.name || "No station"}
                </div>
                <div>
                  <strong>Installed:</strong>{" "}
                  {new Date(selectedCamera.installedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
