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
  Camera,
  Upload,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/lib/store";
import { createReport } from "@/lib/store/slices/citizenReportsSlice";
import { toast } from "sonner";
import Image from "next/image";

const VIOLATION_TYPES = [
  { value: "OVERSPEEDING", label: "Over Speeding" },
  { value: "WRONG_SIDE", label: "Wrong Side Driving" },
  { value: "SIGNAL_BREAKING", label: "Signal Breaking" },
  { value: "NO_HELMET", label: "No Helmet" },
  { value: "ILLEGAL_PARKING", label: "Illegal Parking" },
  { value: "DRUNK_DRIVING", label: "Drunk Driving" },
  { value: "NO_SEATBELT", label: "No Seatbelt" },
  { value: "MOBILE_WHILE_DRIVING", label: "Mobile While Driving" },
  { value: "OTHER", label: "Other Violation" },
];

export default function ReportViolationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    vehiclePlate: "",
    violationType: "",
    description: "",
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

          // Reverse geocode to get address
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

    // Validate file sizes (max 10MB per file)
    const oversizedFiles = validFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("Files must be less than 10MB");
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

  // Upload files to Cloudinary
  const uploadFilesToCloudinary = async () => {
    if (evidenceFiles.length === 0) {
      toast.error("Please upload at least one photo or video");
      return false;
    }

    setIsUploading(true);
    const urls: string[] = [];

    try {
      for (const file of evidenceFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "nirapoth"
        );
        formData.append("folder", "citizen-reports");

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

      setUploadedUrls(urls);
      setIsUploading(false);
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload evidence. Please try again.");
      setIsUploading(false);
      return false;
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

    if (evidenceFiles.length === 0) {
      toast.error("Please upload at least one photo or video as evidence");
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error("Please capture location");
      return;
    }

    // Upload files first
    const uploadSuccess = await uploadFilesToCloudinary();
    if (!uploadSuccess) return;

    // Submit report
    setIsSubmitting(true);
    try {
      await dispatch(
        createReport({
          vehiclePlate: formData.vehiclePlate.toUpperCase(),
          violationType: formData.violationType,
          description: formData.description,
          evidenceUrls: uploadedUrls,
          locationData: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
            city: location.city,
            district: location.district,
            division: "Dhaka", // Can be enhanced with more detailed location
          },
        })
      ).unwrap();

      toast.success(
        "Report submitted successfully! You'll be notified once it's reviewed.",
        { duration: 5000 }
      );
      router.push("/citizen/my-reports");
    } catch (error: any) {
      toast.error(error || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Camera className="h-8 w-8" />
          Report Traffic Violation
        </h1>
        <p className="text-muted-foreground mt-2">
          Help make roads safer by reporting traffic violations. Valid reports
          earn 5% rewards!
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
                <li>Upload clear photos or videos showing the violation</li>
                <li>Ensure vehicle plate number is visible</li>
                <li>Capture exact location of the violation</li>
                <li>Valid reports are reviewed by police and earn 5% reward</li>
                <li>Fake reports result in 5% penalty</li>
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
            {/* Vehicle Plate */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
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
                    onValueChange={(value) =>
                      setFormData({ ...formData, violationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIOLATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about the violation..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
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
                <CardTitle>Upload Evidence *</CardTitle>
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
                      Max 10MB per file. Multiple files allowed.
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
                disabled={
                  isSubmitting ||
                  isUploading ||
                  evidenceFiles.length === 0 ||
                  !location.latitude
                }
              >
                {isSubmitting
                  ? "Submitting..."
                  : isUploading
                  ? "Uploading Evidence..."
                  : "Submit Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
