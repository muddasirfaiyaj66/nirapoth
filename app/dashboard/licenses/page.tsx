import { Metadata } from "next";
import { DrivingLicenseManagement } from "@/components/driving-license/DrivingLicenseManagement";

export const metadata: Metadata = {
  title: "Driving License Management | Nirapoth",
  description: "Manage driving licenses, renewals, and validations",
};

export default function DrivingLicensePage() {
  return <DrivingLicenseManagement />;
}
