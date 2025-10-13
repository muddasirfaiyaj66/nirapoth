"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Database,
  Shield,
  Camera,
  Bell,
  Mail,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Lock,
  Key,
  Server,
  Cloud,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";
import { authFetch } from "@/lib/utils/api";

interface SystemConfig {
  general: {
    systemName: string;
    systemDescription: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    maxFileUploadSize: number;
    sessionTimeout: number;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    ipWhitelisting: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    adminEmailAlerts: boolean;
    criticalAlertsOnly: boolean;
  };
  camera: {
    maxConcurrentStreams: number;
    videoQuality: string;
    recordingEnabled: boolean;
    retentionDays: number;
    aiDetectionEnabled: boolean;
    confidenceThreshold: number;
  };
  database: {
    backupEnabled: boolean;
    backupFrequency: string;
    retentionPeriod: number;
    compressionEnabled: boolean;
  };
}

export default function SystemConfigPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const queryClient = useQueryClient();

  // Check if user is Super Admin
  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Only Super Administrators can access system configuration.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: config,
    isLoading,
    error,
  } = useQuery<SystemConfig>({
    queryKey: ["system-config"],
    queryFn: async () => {
      const response = await authFetch("admin/system/config", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch system configuration");
      }

      const data = await response.json();
      return data.data;
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: any }) => {
      const response = await authFetch("admin/system/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, config: data }),
      });

      if (!response.ok) {
        throw new Error("Failed to update configuration");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Configuration updated successfully");
      setUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
    },
    onError: (error) => {
      toast.error("Failed to update configuration");
      console.error("Update config error:", error);
    },
  });

  const handleSave = (section: string, data: any) => {
    updateConfigMutation.mutate({ section, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load system configuration</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and parameters
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unsavedChanges && (
            <Badge variant="destructive">Unsaved Changes</Badge>
          )}
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Backup Config
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="camera">Camera System</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={config.general.systemName}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.general.sessionTimeout}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea
                  id="systemDescription"
                  value={config.general.systemDescription}
                  onChange={(e) => setUnsavedChanges(true)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable system for maintenance
                    </p>
                  </div>
                  <Switch
                    checked={config.general.maintenanceMode}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and error reporting
                    </p>
                  </div>
                  <Switch
                    checked={config.general.debugMode}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("general", config.general)}
                  disabled={updateConfigMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">
                      Force passwords to include special characters
                    </p>
                  </div>
                  <Switch
                    checked={config.security.requireSpecialChars}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable system-wide 2FA requirement
                    </p>
                  </div>
                  <Switch
                    checked={config.security.twoFactorEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("security", config.security)}
                  disabled={updateConfigMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.emailEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.smsEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.pushEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    handleSave("notifications", config.notifications)
                  }
                  disabled={updateConfigMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Camera Settings */}
        <TabsContent value="camera" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxStreams">Max Concurrent Streams</Label>
                  <Input
                    id="maxStreams"
                    type="number"
                    value={config.camera.maxConcurrentStreams}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoQuality">Video Quality</Label>
                  <Select value={config.camera.videoQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered violation detection
                    </p>
                  </div>
                  <Switch
                    checked={config.camera.aiDetectionEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Recording Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Continuously record camera feeds
                    </p>
                  </div>
                  <Switch
                    checked={config.camera.recordingEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("camera", config.camera)}
                  disabled={updateConfigMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Camera Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={config.database.backupFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">
                    Backup Retention (days)
                  </Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    value={config.database.retentionPeriod}
                    onChange={(e) => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable scheduled database backups
                    </p>
                  </div>
                  <Switch
                    checked={config.database.backupEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compression</Label>
                    <p className="text-sm text-muted-foreground">
                      Compress backup files to save storage
                    </p>
                  </div>
                  <Switch
                    checked={config.database.compressionEnabled}
                    onCheckedChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("database", config.database)}
                  disabled={updateConfigMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Database Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Database className="h-6 w-6" />
              <span>Backup Now</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <RefreshCw className="h-6 w-6" />
              <span>Clear Cache</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Globe className="h-6 w-6" />
              <span>Test Connections</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <AlertTriangle className="h-6 w-6" />
                  <span>System Reset</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>System Reset</DialogTitle>
                  <DialogDescription>
                    This will reset all system configurations to default values.
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Confirm Reset</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
