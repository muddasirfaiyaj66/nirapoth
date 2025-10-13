import { Metadata } from "next";
import { VehicleAssignmentManagement } from "@/components/vehicle-assignment/VehicleAssignmentManagement";

export const metadata: Metadata = {
  title: "Vehicle Assignment | Nirapoth",
  description: "Manage vehicle assignments and driver allocations",
};

export default function VehicleAssignmentPage() {
  return <VehicleAssignmentManagement />;
}
