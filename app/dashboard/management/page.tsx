import { Metadata } from "next";
import { DrivingLicenseManagement } from "@/components/driving-license/DrivingLicenseManagement";
import { VehicleAssignmentManagement } from "@/components/vehicle-assignment/VehicleAssignmentManagement";
import { UserProfileManagement } from "@/components/profile/UserProfileManagement";
import { PoliceManagementDashboard } from "@/components/police/PoliceManagementDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Management Dashboard | Nirapoth",
  description:
    "Comprehensive management dashboard for citizens, police, and administrators",
};

export default function ManagementDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Management Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive management system for licenses, vehicles, profiles,
            and police operations
          </p>
        </div>
      </div>

      <Tabs defaultValue="licenses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="licenses">Driving Licenses</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Assignments</TabsTrigger>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="police">Police Management</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-4">
          <DrivingLicenseManagement />
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <VehicleAssignmentManagement />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <UserProfileManagement />
        </TabsContent>

        <TabsContent value="police" className="space-y-4">
          <PoliceManagementDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
