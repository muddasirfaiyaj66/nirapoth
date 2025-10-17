"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { createLicense } from "@/lib/store/slices/drivingLicenseSlice";
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
import { toast } from "sonner";

const licenseSchema = z.object({
  licenseNo: z.string().min(5, "License number must be at least 5 characters"),
  category: z.enum([
    "LIGHT_VEHICLE",
    "MOTORCYCLE",
    "LIGHT_VEHICLE_MOTORCYCLE",
    "HEAVY_VEHICLE",
    "PUBLIC_SERVICE_VEHICLE",
    "GOODS_VEHICLE",
  ]),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  issuingAuthority: z.string().min(2, "Issuing authority is required"),
});

type LicenseFormData = z.infer<typeof licenseSchema>;

interface AddLicenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddLicenseForm({ onSuccess, onCancel }: AddLicenseFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.drivingLicense);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      issuingAuthority: "BRTA",
    },
  });

  const categoryValue = watch("category");

  const onSubmit = async (data: LicenseFormData) => {
    try {
      await dispatch(createLicense(data)).unwrap();
      toast.success(
        "Driving license added successfully! You received 10 gems!"
      );
      onSuccess();
    } catch (error: any) {
      console.error("Error adding license:", error);
      toast.error(error || "Failed to add driving license");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* License Number */}
      <div className="space-y-2">
        <Label htmlFor="licenseNo">License Number *</Label>
        <Input
          id="licenseNo"
          {...register("licenseNo")}
          placeholder="e.g., DL-001234"
          disabled={loading}
        />
        {errors.licenseNo && (
          <p className="text-sm text-red-500">{errors.licenseNo.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">License Category *</Label>
        <Select
          value={categoryValue}
          onValueChange={(value) => setValue("category", value as any)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select license category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MOTORCYCLE">Motorcycle Only</SelectItem>
            <SelectItem value="LIGHT_VEHICLE">
              Light Vehicle (Cars, Small Vans)
            </SelectItem>
            <SelectItem value="LIGHT_VEHICLE_MOTORCYCLE">
              Light Vehicle + Motorcycle
            </SelectItem>
            <SelectItem value="HEAVY_VEHICLE">
              Heavy Vehicle (Trucks, Buses)
            </SelectItem>
            <SelectItem value="PUBLIC_SERVICE_VEHICLE">
              Public Service Vehicle (Taxi, Bus)
            </SelectItem>
            <SelectItem value="GOODS_VEHICLE">Goods Vehicle</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Issue Date */}
      <div className="space-y-2">
        <Label htmlFor="issueDate">Issue Date *</Label>
        <Input
          id="issueDate"
          type="date"
          {...register("issueDate")}
          disabled={loading}
        />
        {errors.issueDate && (
          <p className="text-sm text-red-500">{errors.issueDate.message}</p>
        )}
      </div>

      {/* Expiry Date */}
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date *</Label>
        <Input
          id="expiryDate"
          type="date"
          {...register("expiryDate")}
          disabled={loading}
        />
        {errors.expiryDate && (
          <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
        )}
      </div>

      {/* Issuing Authority */}
      <div className="space-y-2">
        <Label htmlFor="issuingAuthority">Issuing Authority *</Label>
        <Input
          id="issuingAuthority"
          {...register("issuingAuthority")}
          placeholder="e.g., BRTA, District Transport"
          disabled={loading}
        />
        {errors.issuingAuthority && (
          <p className="text-sm text-red-500">
            {errors.issuingAuthority.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Adding..." : "Add License & Get 10 Gems"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
