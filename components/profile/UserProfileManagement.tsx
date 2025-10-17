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
  Camera,
  Key,
  Car,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchProfile,
  updateProfile,
  fetchStatistics,
  validateProfile,
  changePassword,
  uploadProfileImage,
  clearError,
  type UserProfile as ReduxUserProfile,
} from "@/lib/store/slices/profileSlice";
import { authFetch } from "@/lib/utils/api";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string;
  nationalId: string;
  role: "CITIZEN" | "POLICE_OFFICER" | "ADMIN" | "FIRE_SERVICE";

  // Contact Information
  alternatePhone?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;

  // Present Address
  presentAddress?: string;
  presentCity?: string;
  presentDistrict?: string;
  presentDivision?: string;
  presentPostalCode?: string;

  // Permanent Address
  permanentAddress?: string;
  permanentCity?: string;
  permanentDistrict?: string;
  permanentDivision?: string;
  permanentPostalCode?: string;

  // Professional Information (for police/fire service)
  designation?: string;
  badgeNo?: string;
  joiningDate?: string;
  rank?: string;
  specialization?: string;

  // Profile Status
  isActive: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;

  // Additional Profile Data
  profileImage?: string;
  bio?: string;

  // Related Data
  citizenGem?: {
    amount: number;
    isRestricted: boolean;
  };
  drivingLicenses?: DrivingLicense[];
  vehicleAssignments?: VehicleAssignment[];
  vehiclesOwned?: Vehicle[];
  station?: {
    id: string;
    name: string;
    code: string;
  };
}

interface DrivingLicense {
  id: string;
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
  isActive: boolean;
  createdAt: string;
}

interface VehicleAssignment {
  id: string;
  vehicle: {
    plateNo: string;
    type: string;
    brand: string;
    model: string;
  };
  validUntil?: string;
  isActive: boolean;
}

interface Vehicle {
  id: string;
  plateNo: string;
  type: string;
  brand: string;
  model: string;
}

interface UserStatistics {
  totalVehicles: number;
  activeAssignments: number;
  totalViolations: number;
  gems: number;
  isRestricted: boolean;
  activeLicenses: number;
}

interface ProfileValidation {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
}

interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;

  // Contact Information
  alternatePhone: string;
  emergencyContact: string;
  emergencyContactPhone: string;

  // Present Address
  presentAddress: string;
  presentCity: string;
  presentDistrict: string;
  presentDivision: string;
  presentPostalCode: string;

  // Permanent Address
  permanentAddress: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentDivision: string;
  permanentPostalCode: string;

  // Professional Information (for police/fire service)
  designation: string;
  badgeNo: string;
  joiningDate: string;
  rank: string;
  specialization: string;

  // Additional Info
  bio: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface LicenseFormData {
  licenseNo: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
}

export function UserProfileManagement() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Redux state
  const {
    profile,
    statistics,
    validation: profileValidation,
    loading,
    updateLoading: saving,
    statisticsLoading,
    validationLoading,
    error,
  } = useAppSelector((state) => state.profile);
  const [editing, setEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileFormData>({
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
    presentPostalCode: "",
    permanentAddress: "",
    permanentCity: "",
    permanentDistrict: "",
    permanentDivision: "",
    permanentPostalCode: "",
    designation: "",
    badgeNo: "",
    joiningDate: "",
    rank: "",
    specialization: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [licenseData, setLicenseData] = useState<LicenseFormData>({
    licenseNo: "",
    category: "",
    issueDate: "",
    expiryDate: "",
    issuingAuthority: "",
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
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Clear any existing errors
    dispatch(clearError());

    // Fetch profile data
    dispatch(fetchProfile());
    dispatch(fetchStatistics());
    dispatch(validateProfile());
  }, [dispatch, isAuthenticated, router]);

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
          bloodGroup: userProfile.bloodGroup || "",
          alternatePhone: userProfile.alternatePhone || "",
          emergencyContact: userProfile.emergencyContact || "",
          emergencyContactPhone: userProfile.emergencyContactPhone || "",
          presentAddress: userProfile.presentAddress || "",
          presentCity: userProfile.presentCity || "",
          presentDistrict: userProfile.presentDistrict || "",
          presentDivision: userProfile.presentDivision || "",
          presentPostalCode: userProfile.presentPostalCode || "",
          permanentAddress: userProfile.permanentAddress || "",
          permanentCity: userProfile.permanentCity || "",
          permanentDistrict: userProfile.permanentDistrict || "",
          permanentDivision: userProfile.permanentDivision || "",
          permanentPostalCode: userProfile.permanentPostalCode || "",
          designation: userProfile.designation || "",
          badgeNo: userProfile.badgeNo || "",
          joiningDate: userProfile.joiningDate
            ? userProfile.joiningDate.split("T")[0]
            : "",
          rank: userProfile.rank || "",
          specialization: userProfile.specialization || "",
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

  const fetchStatistics = async () => {
    try {
      const response = await authFetch("profile/statistics");
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  const validateProfile = async () => {
    try {
      const response = await authFetch("profile/validate");
      if (response.ok) {
        const data = await response.json();
        setProfileValidation(data.data);
      }
    } catch (error) {
      console.error("Failed to validate profile:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await authFetch("profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
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
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddLicense = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch("profile/driving-licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(licenseData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Driving license added successfully",
        });
        setLicenseData({
          licenseNo: "",
          category: "",
          issueDate: "",
          expiryDate: "",
          issuingAuthority: "",
        });
        setShowLicenseDialog(false);
        fetchProfile(); // Refresh profile to show new license
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to add driving license",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUploadProfileImage = async (file: File) => {
    try {
      // Here you would typically upload to a cloud service like Cloudinary
      // For now, we'll simulate the upload
      const formData = new FormData();
      formData.append("image", file);

      // This is a placeholder - implement actual image upload logic
      const imageUrl = URL.createObjectURL(file);

      const response = await authFetch("profile/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
        fetchProfile(); // Refresh profile to show new image
      } else {
        toast({
          title: "Error",
          description: "Failed to upload profile image",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile image",
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
      permanentPostalCode: formData.presentPostalCode,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>;
      case "POLICE_OFFICER":
        return <Badge variant="default">Police Officer</Badge>;
      case "FIRE_SERVICE":
        return (
          <Badge variant="default" className="bg-orange-500">
            Fire Service
          </Badge>
        );
      case "CITIZEN":
        return <Badge variant="secondary">Citizen</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getBloodGroupOptions = () => [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  const getLicenseCategoryOptions = () => [
    { value: "LIGHT_VEHICLE", label: "Light Vehicle" },
    { value: "MOTORCYCLE", label: "Motorcycle" },
    { value: "LIGHT_VEHICLE_MOTORCYCLE", label: "Light Vehicle & Motorcycle" },
    { value: "HEAVY_VEHICLE", label: "Heavy Vehicle" },
    { value: "PSV", label: "Public Service Vehicle" },
    { value: "GOODS_VEHICLE", label: "Goods Vehicle" },
  ];

  const getDivisionOptions = () => [
    "Barisal",
    "Chittagong",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
  ];

  const getRankOptions = () => [
    "Constable",
    "Head Constable",
    "Assistant Sub-Inspector",
    "Sub-Inspector",
    "Inspector",
    "Circle Inspector",
    "Additional Superintendent",
    "Superintendent",
    "Deputy Commissioner",
    "Additional Commissioner",
    "Commissioner",
  ];

  const getStatusBadges = (profile: UserProfile) => {
    return (
      <div className="flex gap-2">
        {profile.isActive ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        )}
        {profile.isEmailVerified ? (
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-border"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // If not authenticated or no user, show login prompt
  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-card/50 border-border/50">
          <CardContent className="p-12 text-center space-y-6">
            <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Authentication Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Please log in to access your profile and manage your
                information.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated but profile failed to load, show error
  if (isAuthenticated && user && !profile && !loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-card/50 border-border/50">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Profile not found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Unable to load your profile information. Please try refreshing the
              page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show main interface if authenticated and either loading or have profile data
  if (isAuthenticated && user && profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Profile Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your personal information and settings
                </p>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="backdrop-blur-sm bg-card/50 border-border/50 hover:bg-card/80 transition-all"
                    >
                      Cancel
                    </Button>
                    <Button
                      form="profile-form"
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditing(true)}
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await logout();
                          router.push("/login");
                        } catch (error) {
                          console.error("Logout failed:", error);
                          // Even if logout fails, redirect to login
                          router.push("/login");
                        }
                      }}
                      className="backdrop-blur-sm bg-card/50 border-border/50 hover:bg-card/80 transition-all"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Card className="backdrop-blur-xl bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            <CardContent className="pt-8 relative">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl shadow-primary/10">
                    <AvatarImage
                      src={profile.profileImage || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {getRoleBadge(profile.role)}
                    {getStatusBadges(profile)}
                  </div>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      {profile.email}
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-accent" />
                        </div>
                        {profile.phone}
                      </div>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
