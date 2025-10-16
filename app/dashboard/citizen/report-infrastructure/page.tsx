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
  Construction,
  Upload,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const COMPLAINT_TYPES = [
  { value: "POTHOLE", label: "Pothole / Road Damage" },
  { value: "OPEN_MANHOLE", label: "Open Manhole" },
  { value: "STREETLIGHT", label: "Streetlight Malfunction" },
  { value: "DRAINAGE", label: "Drainage Issue" },
  { value: "GARBAGE", label: "Garbage Accumulation" },
  { value: "SIDEWALK", label: "Sidewalk Damage" },
  { value: "TRAFFIC_SIGN", label: "Missing/Damaged Traffic Sign" },
  { value: "OTHER", label: "Other Infrastructure Issue" },
];

export default function ReportInfrastructurePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
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
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      return isImage;
    });

    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
    setEvidencePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (evidenceFiles.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error("Please capture location");
      return;
    }

    setIsSubmitting(true);
    try {
      toast.success(
        "Infrastructure complaint submitted successfully! City Corporation will review it.",
        { duration: 5000 }
      );
      router.push("/dashboard/citizen/my-infrastructure-reports");
    } catch (error: any) {
      toast.error(error || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 pt-24 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Construction className="h-8 w-8" />
          Report Infrastructure Issue
        </h1>
        <p className="text-muted-foreground mt-2">
          Help improve city infrastructure by reporting issues
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
                <li>Upload clear photos showing the issue</li>
                <li>Provide exact location of the problem</li>
                <li>Describe the issue in detail</li>
                <li>City Corporation will review and take action</li>
                <li>Track progress of your complaint</li>
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
            <Card>
              <CardHeader>
                <CardTitle>Complaint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for the issue"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Issue Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLAINT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

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

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Photos *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="evidence"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="evidence" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">Click to upload photos</p>
                    <p className="text-sm text-muted-foreground">
                      Max 10MB per file. Multiple files allowed.
                    </p>
                  </label>
                </div>

                {evidencePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {evidencePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video relative rounded-lg overflow-hidden border">
                          <Image
                            src={preview}
                            alt={`Evidence ${index + 1}`}
                            fill
                            className="object-cover"
                          />
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  isSubmitting ||
                  evidenceFiles.length === 0 ||
                  !location.latitude
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
