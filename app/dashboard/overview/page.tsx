import { Metadata } from "next";
import { ManagementOverview } from "@/components/management/ManagementOverview";

export const metadata: Metadata = {
  title: "Management Overview | Nirapoth",
  description:
    "Overview of management features and quick access to key functions",
};

export default function ManagementOverviewPage() {
  return <ManagementOverview />;
}
