"use client";

import React, { useState, useEffect } from "react";
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
  User,
  Save,
  Edit,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authFetch } from "@/lib/utils/api";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  nationalId: string;
  role: "CITIZEN" | "POLICE_OFFICER" | "ADMIN";

  // Address Information
  presentAddress?: string;
  permanentAddress?: string;
  city?: string;
  district?: string;
  postalCode?: string;

  // Professional Information
  occupation?: string;
  designation?: string;
  organization?: string;
  workAddress?: string;

  // Contact Information
  emergencyContact?: string;
  emergencyContactPhone?: string;

  // Profile Status
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Additional Profile Data
  profilePicture?: string;
  bio?: string;
}

interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;

  // Address Information
  presentAddress: string;
  permanentAddress: string;
  city: string;
  district: string;
  postalCode: string;

  // Professional Information
  occupation: string;
  designation: string;
  organization: string;
  workAddress: string;

  // Contact Information
  emergencyContact: string;
  emergencyContactPhone: string;

  // Additional Info
  bio: string;
}

export function UserProfileManagement() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    presentAddress: "",
    permanentAddress: "",
    city: "",
    district: "",
    postalCode: "",
    occupation: "",
    designation: "",
    organization: "",
    workAddress: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    bio: "",
  });
  const { toast } = useToast();

  const bangladeshiDistricts = [
    "Barisal",
    "Barguna",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur", // Barisal Division
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chittagong",
    "Comilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati", // Chittagong Division
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail", // Dhaka Division
    "Bagerhat",
    "Chuadanga",
    "Jessore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira", // Khulna Division
    "Jamalpur",
    "Mymensingh",
    "Netrakona",
    "Sherpur", // Mymensingh Division
    "Bogra",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj", // Rajshahi Division
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon", // Rangpur Division
    "Habiganj",
    "Moulvibazar",
    "Sunamganj",
    "Sylhet", // Sylhet Division
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authFetch("profile/me");

      if (response.ok) {
        const data = await response.json();
        const userProfile = data.data;
        setProfile(userProfile);

        // Initialize form data
        setFormData({
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          phone: userProfile.phone || "",
          dateOfBirth: userProfile.dateOfBirth
            ? userProfile.dateOfBirth.split("T")[0]
            : "",
          gender: userProfile.gender || "",
          presentAddress: userProfile.presentAddress || "",
          permanentAddress: userProfile.permanentAddress || "",
          city: userProfile.city || "",
          district: userProfile.district || "",
          postalCode: userProfile.postalCode || "",
          occupation: userProfile.occupation || "",
          designation: userProfile.designation || "",
          organization: userProfile.organization || "",
          workAddress: userProfile.workAddress || "",
          emergencyContact: userProfile.emergencyContact || "",
          emergencyContactPhone: userProfile.emergencyContactPhone || "",
          bio: userProfile.bio || "",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await authFetch("profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setEditing(false);
        fetchProfile();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPresentToPermanent = () => {
    setFormData({
      ...formData,
      permanentAddress: formData.presentAddress,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>;
      case "POLICE_OFFICER":
        return <Badge variant="default">Police Officer</Badge>;
      case "CITIZEN":
        return <Badge variant="secondary">Citizen</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadges = (profile: UserProfile) => {
    return (
      <div className="flex gap-2">
        {profile.isActive ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        )}
        {profile.isVerified ? (
          <Badge variant="default" className="bg-green-500">
            Verified
          </Badge>
        ) : (
          <Badge variant="outline">Unverified</Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Management</h1>
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
              <Button form="profile-form" type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
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

      {editing ? (
        <form
          id="profile-form"
          onSubmit={handleUpdateProfile}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal details and identity information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
              <CardDescription>
                Your residential and contact addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="presentAddress">Present Address</Label>
                <Textarea
                  id="presentAddress"
                  value={formData.presentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, presentAddress: e.target.value })
                  }
                  placeholder="Enter your current residential address..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPresentToPermanent}
                  >
                    Copy Present Address
                  </Button>
                </div>
                <Textarea
                  id="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: e.target.value,
                    })
                  }
                  placeholder="Enter your permanent address..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) =>
                      setFormData({ ...formData, district: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {bangladeshiDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
              <CardDescription>
                Your work and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    placeholder="Enter your occupation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="Enter your designation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  placeholder="Enter your organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workAddress">Work Address</Label>
                <Textarea
                  id="workAddress"
                  value={formData.workAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, workAddress: e.target.value })
                  }
                  placeholder="Enter your workplace address..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
              <CardDescription>
                Contact person in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profilePicture} />
                  <AvatarFallback className="text-lg">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {getRoleBadge(profile.role)}
                    {getStatusBadges(profile)}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                      </div>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">National ID</Label>
                  <p className="font-medium">{profile.nationalId}</p>
                </div>
                {profile.dateOfBirth && (
                  <div>
                    <Label className="text-muted-foreground">
                      Date of Birth
                    </Label>
                    <p className="font-medium">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profile.gender && (
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="font-medium">{profile.gender}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(profile.presentAddress || profile.permanentAddress) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.presentAddress && (
                    <div>
                      <Label className="text-muted-foreground">
                        Present Address
                      </Label>
                      <p className="font-medium">{profile.presentAddress}</p>
                    </div>
                  )}
                  {profile.permanentAddress && (
                    <div>
                      <Label className="text-muted-foreground">
                        Permanent Address
                      </Label>
                      <p className="font-medium">{profile.permanentAddress}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {profile.city && (
                    <div>
                      <Label className="text-muted-foreground">City</Label>
                      <p className="font-medium">{profile.city}</p>
                    </div>
                  )}
                  {profile.district && (
                    <div>
                      <Label className="text-muted-foreground">District</Label>
                      <p className="font-medium">{profile.district}</p>
                    </div>
                  )}
                  {profile.postalCode && (
                    <div>
                      <Label className="text-muted-foreground">
                        Postal Code
                      </Label>
                      <p className="font-medium">{profile.postalCode}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Information */}
          {(profile.occupation ||
            profile.designation ||
            profile.organization) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.occupation && (
                    <div>
                      <Label className="text-muted-foreground">
                        Occupation
                      </Label>
                      <p className="font-medium">{profile.occupation}</p>
                    </div>
                  )}
                  {profile.designation && (
                    <div>
                      <Label className="text-muted-foreground">
                        Designation
                      </Label>
                      <p className="font-medium">{profile.designation}</p>
                    </div>
                  )}
                </div>
                {profile.organization && (
                  <div>
                    <Label className="text-muted-foreground">
                      Organization
                    </Label>
                    <p className="font-medium">{profile.organization}</p>
                  </div>
                )}
                {profile.workAddress && (
                  <div>
                    <Label className="text-muted-foreground">
                      Work Address
                    </Label>
                    <p className="font-medium">{profile.workAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {(profile.emergencyContact || profile.emergencyContactPhone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.emergencyContact && (
                    <div>
                      <Label className="text-muted-foreground">
                        Contact Name
                      </Label>
                      <p className="font-medium">{profile.emergencyContact}</p>
                    </div>
                  )}
                  {profile.emergencyContactPhone && (
                    <div>
                      <Label className="text-muted-foreground">
                        Contact Phone
                      </Label>
                      <p className="font-medium">
                        {profile.emergencyContactPhone}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
