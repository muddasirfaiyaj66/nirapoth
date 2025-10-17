"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { createVehicle } from "@/lib/store/slices/vehicleManagementSlice";
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

const vehicleSchema = z.object({
  type: z.enum(["CAR", "MOTORCYCLE", "TRUCK", "BUS", "BICYCLE", "OTHER"]),
  plateNo: z.string().min(3, "Plate number must be at least 3 characters"),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  color: z.string().optional(),
  engineNo: z.string().min(5, "Engine number must be at least 5 characters"),
  chassisNo: z.string().min(5, "Chassis number must be at least 5 characters"),
  registrationNo: z.string().optional(),
  registrationDate: z.string().optional(),
  expiresAt: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface AddVehicleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddVehicleForm({ onSuccess, onCancel }: AddVehicleFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.vehicleManagement);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const typeValue = watch("type");

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await dispatch(
        createVehicle({
          ...data,
          year: data.year ? parseInt(data.year) : undefined,
        })
      ).unwrap();
      toast.success("Vehicle registered successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast.error(error || "Failed to register vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Vehicle Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Vehicle Type *</Label>
        <Select
          value={typeValue}
          onValueChange={(value) => setValue("type", value as any)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CAR">🚗 Car</SelectItem>
            <SelectItem value="MOTORCYCLE">🏍️ Motorcycle</SelectItem>
            <SelectItem value="TRUCK">🚚 Truck</SelectItem>
            <SelectItem value="BUS">🚌 Bus</SelectItem>
            <SelectItem value="BICYCLE">🚲 Bicycle</SelectItem>
            <SelectItem value="OTHER">🚙 Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Plate Number */}
      <div className="space-y-2">
        <Label htmlFor="plateNo">Plate Number *</Label>
        <Input
          id="plateNo"
          {...register("plateNo")}
          placeholder="e.g., ঢাকা মেট্রো-গ-১২৩৪"
          disabled={loading}
        />
        {errors.plateNo && (
          <p className="text-sm text-red-500">{errors.plateNo.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            {...register("brand")}
            placeholder="e.g., Toyota"
            disabled={loading}
          />
          {errors.brand && (
            <p className="text-sm text-red-500">{errors.brand.message}</p>
          )}
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            {...register("model")}
            placeholder="e.g., Corolla"
            disabled={loading}
          />
          {errors.model && (
            <p className="text-sm text-red-500">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...register("year")}
            placeholder="e.g., 2020"
            min="1900"
            max={new Date().getFullYear() + 1}
            disabled={loading}
          />
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            {...register("color")}
            placeholder="e.g., White"
            disabled={loading}
          />
          {errors.color && (
            <p className="text-sm text-red-500">{errors.color.message}</p>
          )}
        </div>
      </div>

      {/* Engine Number */}
      <div className="space-y-2">
        <Label htmlFor="engineNo">Engine Number *</Label>
        <Input
          id="engineNo"
          {...register("engineNo")}
          placeholder="e.g., ENG123456"
          disabled={loading}
        />
        {errors.engineNo && (
          <p className="text-sm text-red-500">{errors.engineNo.message}</p>
        )}
      </div>

      {/* Chassis Number */}
      <div className="space-y-2">
        <Label htmlFor="chassisNo">Chassis Number *</Label>
        <Input
          id="chassisNo"
          {...register("chassisNo")}
          placeholder="e.g., CHS123456"
          disabled={loading}
        />
        {errors.chassisNo && (
          <p className="text-sm text-red-500">{errors.chassisNo.message}</p>
        )}
      </div>

      {/* Tax Token Number */}
      <div className="space-y-2">
        <Label htmlFor="registrationNo">Tax Token Number</Label>
        <Input
          id="registrationNo"
          {...register("registrationNo")}
          placeholder="e.g., TAX123456"
          disabled={loading}
        />
        {errors.registrationNo && (
          <p className="text-sm text-red-500">
            {errors.registrationNo.message}
          </p>
        )}
      </div>

      {/* Registration Date */}
      <div className="space-y-2">
        <Label htmlFor="registrationDate">Registration Date</Label>
        <Input
          id="registrationDate"
          type="date"
          {...register("registrationDate")}
          disabled={loading}
        />
        {errors.registrationDate && (
          <p className="text-sm text-red-500">
            {errors.registrationDate.message}
          </p>
        )}
      </div>

      {/* Tax Token Expiry */}
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Tax Token Expiry Date</Label>
        <Input
          id="expiresAt"
          type="date"
          {...register("expiresAt")}
          disabled={loading}
        />
        {errors.expiresAt && (
          <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Registering..." : "Register Vehicle"}
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
