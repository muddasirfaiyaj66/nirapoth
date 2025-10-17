"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchProfile,
  updateProfile,
  fetchStatistics,
  validateProfile,
  changePassword,
  uploadProfileImage,
  clearError,
} from "@/lib/store/slices/profileSlice";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Save,
  Edit,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressSelector } from "@/components/forms/AddressSelector";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Redux state
  const {
    profile,
    statistics,
    validation,
    loading,
    updateLoading,
    statisticsLoading,
    validationLoading,
    error,
  } = useAppSelector((state) => state.profile);

  const [editing, setEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    alternatePhone: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    presentAddress: "",
    presentCity: "",
    presentDistrict: "",
    presentDivision: "",
    presentUpazila: "",
    presentPostalCode: "",
    permanentAddress: "",
    permanentCity: "",
    permanentDistrict: "",
    permanentDivision: "",
    permanentUpazila: "",
    permanentPostalCode: "",
    designation: "",
    badgeNo: "",
    joiningDate: "",
    rank: "",
    specialization: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile data on mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchProfile());
    dispatch(fetchStatistics());
    dispatch(validateProfile());
  }, [dispatch]);

  // Update form data when profile loads or changes
  useEffect(() => {
    if (profile) {
      console.log("Profile updated, syncing form data:", profile);
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: profile.gender || "",
        bloodGroup: profile.bloodGroup || "",
        alternatePhone: profile.alternatePhone || "",
        emergencyContact: profile.emergencyContact || "",
        emergencyContactPhone: profile.emergencyContactPhone || "",
        presentAddress: profile.presentAddress || "",
        presentCity: profile.presentCity || "",
        presentDistrict: profile.presentDistrict || "",
        presentDivision: profile.presentDivision || "",
        presentUpazila: profile.presentUpazila || "",
        presentPostalCode: profile.presentPostalCode || "",
        permanentAddress: profile.permanentAddress || "",
        permanentCity: profile.permanentCity || "",
        permanentDistrict: profile.permanentDistrict || "",
        permanentDivision: profile.permanentDivision || "",
        permanentUpazila: profile.permanentUpazila || "",
        permanentPostalCode: profile.permanentPostalCode || "",
        designation: profile.designation || "",
        badgeNo: profile.badgeNo || "",
        joiningDate: profile.joiningDate
          ? new Date(profile.joiningDate).toISOString().split("T")[0]
          : "",
        rank: profile.rank || "",
        specialization: profile.specialization || "",
      });
    }
  }, [profile]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Cast formData to proper type
      const updateData: any = {
        ...formData,
        gender: formData.gender || undefined,
        bloodGroup: formData.bloodGroup || undefined,
      };
      await dispatch(updateProfile(updateData)).unwrap();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditing(false);
      // Refresh all profile data
      dispatch(fetchProfile());
      dispatch(fetchStatistics());
      dispatch(validateProfile());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(changePassword(passwordData)).unwrap();
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !imagePreview) return;

    try {
      // Send the base64 image data directly
      await dispatch(uploadProfileImage({ imageUrl: imagePreview })).unwrap();
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      setImageFile(null);
      setImagePreview(null);
      // Refresh profile to get the updated image
      dispatch(fetchProfile());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleCopyPresentToPermanent = () => {
    setFormData({
      ...formData,
      permanentAddress: formData.presentAddress,
      permanentCity: formData.presentCity,
      permanentDistrict: formData.presentDistrict,
      permanentDivision: formData.presentDivision,
      permanentUpazila: formData.presentUpazila,
      permanentPostalCode: formData.presentPostalCode,
    });
    toast({
      title: "Copied",
      description: "Present address copied to permanent address",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      case "POLICE":
        return "default";
      case "FIRE_SERVICE":
        return "default";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Profile not found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Unable to load your profile. Please try again.
                </p>
              </div>
              <Button onClick={() => dispatch(fetchProfile())}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 my-10 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                form="profile-form"
                type="submit"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion Alert */}
      {validation && !validation.isComplete && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile is {validation.completionPercentage}% complete. Please
            complete the missing fields: {validation.missingFields.join(", ")}
          </AlertDescription>
          <Progress value={validation.completionPercentage} className="mt-2" />
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4">
                <AvatarImage src={imagePreview || profile.profileImage} />
                <AvatarFallback className="text-3xl">
                  {profile.firstName?.charAt(0) || "U"}
                  {profile.lastName?.charAt(0) || "N"}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <Label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90"
              >
                <Upload className="h-5 w-5" />
              </Label>
              {imageFile && (
                <div className="absolute -bottom-12 left-0 right-0 flex gap-2">
                  <Button size="sm" onClick={handleImageUpload}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <Badge variant={getRoleBadgeVariant(profile.role)}>
                  {profile.role}
                </Badge>
                {profile.isActive && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                )}
                {profile.designation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {profile.designation}
                  </div>
                )}
              </div>

              {/* Statistics */}
              {statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-secondary/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Vehicles</p>
                    <p className="text-2xl font-bold">
                      {statistics.totalVehicles || 0}
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Violations</p>
                    <p className="text-2xl font-bold">
                      {statistics.totalViolations || 0}
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Licenses</p>
                    <p className="text-2xl font-bold">
                      {statistics.activeLicenses || 0}
                    </p>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Gems</p>
                    <p className="text-2xl font-bold">{statistics.gems || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="address">
            <MapPin className="h-4 w-4 mr-2" />
            Address
          </TabsTrigger>
          <TabsTrigger value="professional">
            <Briefcase className="h-4 w-4 mr-2" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <form id="profile-form" onSubmit={handleUpdateProfile}>
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        handleSelectChange("bloodGroup", value)
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">
                      Emergency Contact Phone
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Information Tab */}
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>
                  Manage your present and permanent address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Present Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Present Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="presentAddress">Address</Label>
                      <Textarea
                        id="presentAddress"
                        name="presentAddress"
                        value={formData.presentAddress}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="presentCity">City/Upazila</Label>
                      <Input
                        id="presentCity"
                        name="presentCity"
                        value={formData.presentCity}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <AddressSelector
                        divisionValue={formData.presentDivision}
                        districtValue={formData.presentDistrict}
                        upazilaValue={formData.presentUpazila}
                        onDivisionChange={(id, name) => {
                          setFormData({
                            ...formData,
                            presentDivision: id,
                          });
                        }}
                        onDistrictChange={(id, name) => {
                          setFormData({
                            ...formData,
                            presentDistrict: id,
                          });
                        }}
                        onUpazilaChange={(id, name) => {
                          setFormData({
                            ...formData,
                            presentUpazila: id,
                          });
                        }}
                        disabled={!editing}
                        showLabels={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="presentPostalCode">Postal Code</Label>
                      <Input
                        id="presentPostalCode"
                        name="presentPostalCode"
                        value={formData.presentPostalCode}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>

                {editing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyPresentToPermanent}
                    className="w-full"
                  >
                    Copy Present Address to Permanent Address
                  </Button>
                )}

                {/* Permanent Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Permanent Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="permanentAddress">Address</Label>
                      <Textarea
                        id="permanentAddress"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanentCity">City/Upazila</Label>
                      <Input
                        id="permanentCity"
                        name="permanentCity"
                        value={formData.permanentCity}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <AddressSelector
                        divisionValue={formData.permanentDivision}
                        districtValue={formData.permanentDistrict}
                        upazilaValue={formData.permanentUpazila}
                        onDivisionChange={(id, name) => {
                          setFormData({
                            ...formData,
                            permanentDivision: id,
                          });
                        }}
                        onDistrictChange={(id, name) => {
                          setFormData({
                            ...formData,
                            permanentDistrict: id,
                          });
                        }}
                        onUpazilaChange={(id, name) => {
                          setFormData({
                            ...formData,
                            permanentUpazila: id,
                          });
                        }}
                        disabled={!editing}
                        showLabels={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentPostalCode">Postal Code</Label>
                      <Input
                        id="permanentPostalCode"
                        name="permanentPostalCode"
                        value={formData.permanentPostalCode}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Work-related details for police and fire service personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badgeNo">Badge Number</Label>
                    <Input
                      id="badgeNo"
                      name="badgeNo"
                      value={formData.badgeNo}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank</Label>
                    <Input
                      id="rank"
                      name="rank"
                      value={formData.rank}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      name="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog
                  open={showPasswordDialog}
                  onOpenChange={setShowPasswordDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPasswordDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updateLoading}>
                          {updateLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Changing...
                            </>
                          ) : (
                            "Change Password"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Account Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Email Verified:</span>
                      <Badge
                        variant={
                          profile.isEmailVerified ? "default" : "secondary"
                        }
                      >
                        {profile.isEmailVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Status:</span>
                      <Badge
                        variant={profile.isActive ? "default" : "secondary"}
                      >
                        {profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Since:</span>
                      <span className="text-muted-foreground">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
