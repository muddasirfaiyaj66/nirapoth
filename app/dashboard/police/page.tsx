import { Metadata } from "next";
import { PoliceManagementDashboard } from "@/components/police/PoliceManagementDashboard";

export const metadata: Metadata = {
  title: "Police Management | Nirapoth",
  description: "Manage police stations, officers, and assignments",
};

export default function PoliceManagementPage() {
  return <PoliceManagementDashboard />;
}
