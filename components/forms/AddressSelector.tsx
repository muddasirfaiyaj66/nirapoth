"use client";

import React, { useState, useEffect } from "react";
import { bdGeoApi, Division, District, Upazila } from "@/lib/api/bdGeo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddressSelectorProps {
  // Values (IDs from the database)
  divisionValue?: string;
  districtValue?: string;
  upazilaValue?: string;

  // Change handlers
  onDivisionChange?: (value: string, name: string) => void;
  onDistrictChange?: (value: string, name: string) => void;
  onUpazilaChange?: (value: string, name: string) => void;

  // Optional props
  required?: boolean;
  disabled?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function AddressSelector({
  divisionValue,
  districtValue,
  upazilaValue,
  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  required = false,
  disabled = false,
  showLabels = true,
  className = "",
}: AddressSelectorProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  const [loading, setLoading] = useState({
    divisions: true,
    districts: false,
    upazilas: false,
  });

  // Load divisions on mount
  useEffect(() => {
    loadDivisions();
  }, []);

  // Load districts when division changes
  useEffect(() => {
    if (divisionValue) {
      loadDistricts(divisionValue);
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [divisionValue]);

  // Load upazilas when district changes
  useEffect(() => {
    if (districtValue) {
      loadUpazilas(districtValue);
    } else {
      setUpazilas([]);
    }
  }, [districtValue]);

  const loadDivisions = async () => {
    try {
      setLoading((prev) => ({ ...prev, divisions: true }));
      const data = await bdGeoApi.getDivisions();
      setDivisions(data);
    } catch (error) {
      console.error("Failed to load divisions:", error);
    } finally {
      setLoading((prev) => ({ ...prev, divisions: false }));
    }
  };

  const loadDistricts = async (divisionId: string) => {
    try {
      setLoading((prev) => ({ ...prev, districts: true }));
      const data = await bdGeoApi.getDistricts(divisionId);
      setDistricts(data);
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const loadUpazilas = async (districtId: string) => {
    try {
      setLoading((prev) => ({ ...prev, upazilas: true }));
      const data = await bdGeoApi.getUpazilas(districtId);
      setUpazilas(data);
    } catch (error) {
      console.error("Failed to load upazilas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, upazilas: false }));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Division */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="division">
            Division {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          value={divisionValue}
          onValueChange={(value) => {
            const selectedDivision = divisions.find((d) => d.id === value);
            onDivisionChange?.(value, selectedDivision?.name || "");
            // Reset dependent fields
            onDistrictChange?.("", "");
            onUpazilaChange?.("", "");
          }}
          disabled={disabled || loading.divisions}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loading.divisions ? "Loading..." : "Select Division"}
            />
          </SelectTrigger>
          <SelectContent>
            {loading.divisions ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              divisions.map((division) => (
                <SelectItem key={division.id} value={division.id}>
                  {division.name} ({division.bn_name})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="district">
            District {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          value={districtValue}
          onValueChange={(value) => {
            const selectedDistrict = districts.find((d) => d.id === value);
            onDistrictChange?.(value, selectedDistrict?.name || "");
            // Reset dependent field
            onUpazilaChange?.("", "");
          }}
          disabled={disabled || !divisionValue || loading.districts}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !divisionValue
                  ? "Select Division First"
                  : loading.districts
                  ? "Loading..."
                  : "Select District"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {loading.districts ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name} ({district.bn_name})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Upazila/Thana */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="upazila">
            Upazila/Thana {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          value={upazilaValue}
          onValueChange={(value) => {
            const selectedUpazila = upazilas.find((u) => u.id === value);
            onUpazilaChange?.(value, selectedUpazila?.name || "");
          }}
          disabled={disabled || !districtValue || loading.upazilas}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !districtValue
                  ? "Select District First"
                  : loading.upazilas
                  ? "Loading..."
                  : "Select Upazila/Thana"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {loading.upazilas ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              upazilas.map((upazila) => (
                <SelectItem key={upazila.id} value={upazila.id}>
                  {upazila.name} ({upazila.bn_name})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
