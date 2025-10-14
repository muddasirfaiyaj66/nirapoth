"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  aiIntegrationApi,
  AccidentData,
  AIStats,
  DetectionResult,
} from "@/lib/api/aiIntegration";
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
  Brain,
  AlertTriangle,
  Camera,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Upload,
  RefreshCw,
  Activity,
  Shield,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function AIMonitoringDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [accidents, setAccidents] = useState<AccidentData[]>([]);
  const [aiStats, setAIStats] = useState<AIStats | null>(null);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [healthStatus, setHealthStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Dialog states
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDetectionDialogOpen, setIsDetectionDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Form states
  const [alertFormData, setAlertFormData] = useState({
    type: "accident" as "accident" | "fire" | "traffic_violation",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    location: {
      latitude: 23.8103,
      longitude: 90.4125,
      address: "Dhaka, Bangladesh",
    },
    description: "",
    confidence: 0.8,
    vehiclesInvolved: [] as string[],
  });

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [accidentsRes, statsRes, healthRes] = await Promise.all([
        aiIntegrationApi.getAccidentData(),
        aiIntegrationApi.getAIStats(),
        aiIntegrationApi.checkHealth(),
      ]);

      if (accidentsRes.success) setAccidents(accidentsRes.data || []);
      if (statsRes.success) setAIStats(statsRes.data);
      setHealthStatus(healthRes);
    } catch (error) {
      console.error("Error fetching AI data:", error);
      toast.error("Failed to fetch AI monitoring data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAlert = async () => {
    try {
      const response = await aiIntegrationApi.sendAccidentAlert(alertFormData);
      if (response.success) {
        toast.success("Alert sent successfully");
        setIsAlertDialogOpen(false);
        setAlertFormData({
          type: "accident",
          severity: "medium",
          location: {
            latitude: 23.8103,
            longitude: 90.4125,
            address: "Dhaka, Bangladesh",
          },
          description: "",
          confidence: 0.8,
          vehiclesInvolved: [],
        });
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error sending alert:", error);
      toast.error(error.response?.data?.message || "Failed to send alert");
    }
  };

  const handleImageDetection = async () => {
    if (!selectedImage) return;

    try {
      const response = await aiIntegrationApi.detectInImage(selectedImage);
      if (response.success) {
        setDetections(response.data.detections || []);
        toast.success("Image detection completed successfully");
      }
    } catch (error: any) {
      console.error("Error detecting in image:", error);
      toast.error(error.response?.data?.message || "Failed to detect in image");
    }
  };

  const handleSyncData = async () => {
    try {
      const response = await aiIntegrationApi.syncAccidentData();
      if (response.success) {
        toast.success(`Successfully synced ${response.data.synced} accidents`);
        fetchAllData();
      }
    } catch (error: any) {
      console.error("Error syncing data:", error);
      toast.error(error.response?.data?.message || "Failed to sync data");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recorded":
        return "bg-blue-100 text-blue-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAccidents = accidents.filter(
    (accident) =>
      accident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accident.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (accident.type &&
        accident.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading AI monitoring dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Monitoring Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time AI accident detection and monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchAllData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSyncData} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>

      {/* AI Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Service Status
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  healthStatus?.success ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {healthStatus?.success ? "Healthy" : "Unhealthy"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthStatus?.message || "Status unknown"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Accidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accidents.length}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              AI detected incidents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service URL</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">
              {aiStats?.serviceUrl || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last sync:{" "}
              {aiStats?.lastSync
                ? new Date(aiStats.lastSync).toLocaleString()
                : "Never"}
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
          <TabsTrigger value="accidents">Accidents</TabsTrigger>
          <TabsTrigger value="detection">Image Detection</TabsTrigger>
          <TabsTrigger value="alerts">Send Alert</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Accidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {accidents.slice(0, 5).map((accident) => (
                    <div
                      key={accident.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {accident.type || "Accident"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {(accident.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Badge className={getStatusColor(accident.status)}>
                        {accident.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Service Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Service Status:</span>
                    <Badge
                      className={
                        aiStats?.aiServiceStatus === "healthy"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {aiStats?.aiServiceStatus || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Accidents:</span>
                    <span className="font-medium">
                      {aiStats?.totalAccidents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Sync:</span>
                    <span className="text-sm text-muted-foreground">
                      {aiStats?.lastSync
                        ? new Date(aiStats.lastSync).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accidents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search accidents..."
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
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccidents.map((accident) => (
                    <TableRow key={accident.id}>
                      <TableCell className="font-mono text-sm">
                        {accident.id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {accident.type || "Accident"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${accident.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm">
                            {(accident.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(accident.status)}>
                          {accident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {accident.vehicles_involved?.join(", ") || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(accident.timestamp).toLocaleDateString()}
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

        <TabsContent value="detection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">
                    Upload Image for Detection
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedImage(e.target.files?.[0] || null)
                    }
                    className="mt-1"
                  />
                </div>

                {selectedImage && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedImage.name}
                    </p>
                    <Button onClick={handleImageDetection} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Detect Objects
                    </Button>
                  </div>
                )}

                {detections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Detection Results:</h4>
                    <div className="space-y-1">
                      {detections.map((detection, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">
                              {detection.label}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              Confidence:{" "}
                              {(detection.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Badge variant="outline">
                            BBox: [{detection.bbox.join(", ")}]
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Accident Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Alert Type</Label>
                    <Select
                      value={alertFormData.type}
                      onValueChange={(value) =>
                        setAlertFormData({
                          ...alertFormData,
                          type: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="traffic_violation">
                          Traffic Violation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      value={alertFormData.severity}
                      onValueChange={(value) =>
                        setAlertFormData({
                          ...alertFormData,
                          severity: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={alertFormData.description}
                    onChange={(e) =>
                      setAlertFormData({
                        ...alertFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the incident..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={alertFormData.location.latitude}
                      onChange={(e) =>
                        setAlertFormData({
                          ...alertFormData,
                          location: {
                            ...alertFormData.location,
                            latitude: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={alertFormData.location.longitude}
                      onChange={(e) =>
                        setAlertFormData({
                          ...alertFormData,
                          location: {
                            ...alertFormData.location,
                            longitude: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence (0-1)</Label>
                  <Input
                    id="confidence"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={alertFormData.confidence}
                    onChange={(e) =>
                      setAlertFormData({
                        ...alertFormData,
                        confidence: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <Button onClick={handleSendAlert} className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
