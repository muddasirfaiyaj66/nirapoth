"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useAppDispatch } from "@/lib/store";
import { createViolation } from "@/lib/store/slices/violationSlice";

const VIOLATION_TYPES = [
  { value: "OVERSPEEDING", label: "Over Speeding", fine: 5000 },
  { value: "WRONG_SIDE", label: "Wrong Side Driving", fine: 3000 },
  { value: "SIGNAL_BREAKING", label: "Signal Breaking", fine: 2000 },
  { value: "NO_HELMET", label: "No Helmet", fine: 500 },
  { value: "ILLEGAL_PARKING", label: "Illegal Parking", fine: 1000 },
  { value: "DRUNK_DRIVING", label: "Drunk Driving", fine: 10000 },
  { value: "NO_SEATBELT", label: "No Seatbelt", fine: 500 },
  { value: "MOBILE_WHILE_DRIVING", label: "Mobile While Driving", fine: 1000 },
  { value: "OVERLOADING", label: "Overloading", fine: 3000 },
  { value: "NO_LICENSE", label: "No License", fine: 5000 },
  { value: "EXPIRED_LICENSE", label: "Expired License", fine: 2000 },
  { value: "NO_FITNESS", label: "No Fitness Certificate", fine: 2000 },
  { value: "NO_INSURANCE", label: "No Insurance", fine: 3000 },
  { value: "MODIFIED_VEHICLE", label: "Modified Vehicle", fine: 5000 },
  { value: "OTHER", label: "Other Violation", fine: 1000 },
];

export default function ManualCaseLoggingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    vehiclePlate: "",
    violationType: "",
    description: "",
    fineAmount: "",
  });

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
    city: "",
    district: "",
  });

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Get current location
  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));

          // Reverse geocode
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              address: data.display_name || "",
              city: data.address.city || data.address.town || "",
              district: data.address.state_district || "",
            });
            toast.success("Location captured successfully!");
          } catch (error) {
            toast.error("Could not get address details");
          }
          setGettingLocation(false);
        },
        (error) => {
          toast.error(
            "Could not get your location. Please enable location services."
          );
          setGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setGettingLocation(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    if (validFiles.length !== files.length) {
      toast.error("Only image and video files are allowed");
    }

    // Validate file sizes (max 5MB for images, 100MB for videos)
    const oversizedFiles = validFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const maxImageSize = 5 * 1024 * 1024; // 5MB
      const maxVideoSize = 100 * 1024 * 1024; // 100MB

      if (isImage && file.size > maxImageSize) {
        return true;
      }
      if (isVideo && file.size > maxVideoSize) {
        return true;
      }
      return false;
    });

    if (oversizedFiles.length > 0) {
      const hasOversizedImage = oversizedFiles.some((f) =>
        f.type.startsWith("image/")
      );
      const hasOversizedVideo = oversizedFiles.some((f) =>
        f.type.startsWith("video/")
      );

      if (hasOversizedImage && hasOversizedVideo) {
        toast.error("Images must be less than 5MB and videos less than 100MB");
      } else if (hasOversizedImage) {
        toast.error("Images must be less than 5MB");
      } else {
        toast.error("Videos must be less than 100MB");
      }
      return;
    }

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove evidence file
  const handleRemoveEvidence = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    setEvidencePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload files to Cloudinary (or use data URLs as fallback)
  const uploadFilesToCloudinary = async () => {
    if (evidenceFiles.length === 0) return true; // Optional

    setIsUploading(true);
    const urls: string[] = [];

    // Check if Cloudinary is configured
    const cloudinaryConfigured = !!(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      for (const file of evidenceFiles) {
        if (!cloudinaryConfigured) {
          // Fallback: Use data URLs for local development
          console.warn("Cloudinary not configured. Using data URL fallback.");
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });
          urls.push(dataUrl);
        } else {
          // Upload to Cloudinary
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
          );
          formData.append("folder", "manual-cases");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          urls.push(data.secure_url);
        }
      }

      setUploadedUrls(urls);
      setIsUploading(false);
      if (evidenceFiles.length > 0) {
        toast.success(
          cloudinaryConfigured
            ? "Evidence uploaded successfully"
            : "Evidence saved locally (Cloudinary not configured)"
        );
      }
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload evidence. Please try again.");
      setIsUploading(false);
      return false;
    }
  };

  // Handle violation type change
  const handleViolationTypeChange = (value: string) => {
    setFormData({ ...formData, violationType: value });
    const violation = VIOLATION_TYPES.find((v) => v.value === value);
    if (violation) {
      setFormData((prev) => ({
        ...prev,
        violationType: value,
        fineAmount: violation.fine.toString(),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.vehiclePlate) {
      toast.error("Please enter vehicle plate number");
      return;
    }

    if (!formData.violationType) {
      toast.error("Please select violation type");
      return;
    }

    if (!formData.fineAmount || parseFloat(formData.fineAmount) <= 0) {
      toast.error("Please enter a valid fine amount");
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error("Please capture location");
      return;
    }

    // Upload files if any
    const uploadSuccess = await uploadFilesToCloudinary();
    if (!uploadSuccess) return;

    // Submit case
    setIsSubmitting(true);
    try {
      await dispatch(
        createViolation({
          vehicle_plate_no: formData.vehiclePlate.toUpperCase(),
          violation_type: formData.violationType,
          description: formData.description,
          fine_amount: parseFloat(formData.fineAmount),
          evidence_urls: uploadedUrls,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
            city: location.city,
            district: location.district,
          },
          detected_by: "MANUAL",
        })
      ).unwrap();

      toast.success(
        "Violation case filed successfully! Fine notice will be sent to the vehicle owner.",
        { duration: 5000 }
      );
      router.push("/dashboard/police");
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to file case";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Manual Case Logging
        </h1>
        <p className="text-muted-foreground mt-2">
          File violation cases manually for offenses not detected by AI
        </p>
      </div>

      {/* Info Alert */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Important Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>Upload clear evidence (photos/videos) if available</li>
                <li>Ensure vehicle plate number is correct</li>
                <li>Capture exact location of the violation</li>
                <li>Fine notice will be automatically sent to vehicle owner</li>
                <li>Case details will be recorded in the system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Vehicle & Violation Info */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate">
                    Vehicle Plate Number *{" "}
                    <span className="text-xs text-muted-foreground">
                      (e.g., DHK-1234)
                    </span>
                  </Label>
                  <Input
                    id="vehiclePlate"
                    placeholder="Enter plate number"
                    value={formData.vehiclePlate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehiclePlate: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="violationType">Violation Type *</Label>
                  <Select
                    value={formData.violationType}
                    onValueChange={handleViolationTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIOLATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - {type.fine} BDT
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fineAmount">Fine Amount (BDT) *</Label>
                  <Input
                    id="fineAmount"
                    type="number"
                    placeholder="Enter fine amount"
                    value={formData.fineAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, fineAmount: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Details *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the violation in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  variant="outline"
                  className="w-full"
                >
                  {gettingLocation ? (
                    <>Getting Location...</>
                  ) : location.latitude ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Location Captured
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Capture Current Location
                    </>
                  )}
                </Button>

                {location.address && (
                  <div className="text-sm space-y-1 p-3 bg-accent rounded-lg">
                    <p className="font-medium">Address:</p>
                    <p className="text-muted-foreground">{location.address}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                      {location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Evidence Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Evidence (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="evidence"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="evidence" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">
                      Click to upload photos or videos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Max 5MB for images, 100MB for videos. Multiple files
                      allowed.
                    </p>
                  </label>
                </div>

                {/* Evidence Previews */}
                {evidencePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {evidencePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video relative rounded-lg overflow-hidden border">
                          {evidenceFiles[index].type.startsWith("image/") ? (
                            <Image
                              src={preview}
                              alt={`Evidence ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={preview}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveEvidence(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || isUploading || !location.latitude}
              >
                {isSubmitting
                  ? "Filing Case..."
                  : isUploading
                  ? "Uploading Evidence..."
                  : "File Violation Case"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
