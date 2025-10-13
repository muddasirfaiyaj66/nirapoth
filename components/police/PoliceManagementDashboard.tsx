"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  Shield,
  Users,
  Building,
  MapPin,
  Star,
  Crown,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authFetch } from "@/lib/utils/api";

interface PoliceStation {
  id: string;
  name: string;
  code: string;
  district: string;
  address: string;
  contactNumber?: string;
  inChargeId?: string;
  isActive: boolean;
  createdAt: string;

  inCharge?: {
    id: string;
    firstName: string;
    lastName: string;
    rank: string;
  };

  officers?: PoliceOfficer[];
  _count?: {
    officers: number;
  };
}

interface PoliceOfficer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rank:
    | "CONSTABLE"
    | "HEAD_CONSTABLE"
    | "SUB_INSPECTOR"
    | "ASSISTANT_SUB_INSPECTOR"
    | "INSPECTOR"
    | "ADDITIONAL_SP"
    | "SP"
    | "ADDITIONAL_DIG"
    | "DIG"
    | "ADDITIONAL_IG"
    | "IG"
    | "DIG_RANGE"
    | "ADDITIONAL_IGP"
    | "IGP";
  badgeNumber?: string;
  stationId?: string;
  isActive: boolean;

  station?: {
    id: string;
    name: string;
    district: string;
  };
}

interface CreateStationFormData {
  name: string;
  code: string;
  district: string;
  address: string;
  contactNumber: string;
  inChargeId: string;
}

interface AssignOfficerFormData {
  stationId: string;
  officerId: string;
  rank: string;
}

interface CreateOfficerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rank: string;
  badgeNumber: string;
  stationId: string;
}

export function PoliceManagementDashboard() {
  const [activeTab, setActiveTab] = useState("stations");
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [officers, setOfficers] = useState<PoliceOfficer[]>([]);
  const [availableOfficers, setAvailableOfficers] = useState<PoliceOfficer[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");

  const [isStationDialogOpen, setIsStationDialogOpen] = useState(false);
  const [isOfficerDialogOpen, setIsOfficerDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const [stationFormData, setStationFormData] = useState<CreateStationFormData>(
    {
      name: "",
      code: "",
      district: "",
      address: "",
      contactNumber: "",
      inChargeId: "",
    }
  );

  const [officerFormData, setOfficerFormData] = useState<CreateOfficerFormData>(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rank: "",
      badgeNumber: "",
      stationId: "",
    }
  );

  const [assignFormData, setAssignFormData] = useState<AssignOfficerFormData>({
    stationId: "",
    officerId: "",
    rank: "",
  });

  const { toast } = useToast();

  const bangladeshiDistricts = [
    "Barisal",
    "Barguna",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chittagong",
    "Comilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
    "Bagerhat",
    "Chuadanga",
    "Jessore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
    "Jamalpur",
    "Mymensingh",
    "Netrakona",
    "Sherpur",
    "Bogra",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
    "Habiganj",
    "Moulvibazar",
    "Sunamganj",
    "Sylhet",
  ];

  const policeRanks = [
    "CONSTABLE",
    "HEAD_CONSTABLE",
    "ASSISTANT_SUB_INSPECTOR",
    "SUB_INSPECTOR",
    "INSPECTOR",
    "ADDITIONAL_SP",
    "SP",
    "ADDITIONAL_DIG",
    "DIG",
    "DIG_RANGE",
    "ADDITIONAL_IG",
    "IG",
    "ADDITIONAL_IGP",
    "IGP",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stationsRes, officersRes, availableOfficersRes] =
        await Promise.all([
          authFetch("police/stations"),
          authFetch("police/officers"),
          authFetch("police/officers/unassigned"),
        ]);

      if (stationsRes.ok) {
        const stationsData = await stationsRes.json();
        setStations(stationsData.data || []);
      }

      if (officersRes.ok) {
        const officersData = await officersRes.json();
        setOfficers(officersData.data || []);
      }

      if (availableOfficersRes.ok) {
        const availableData = await availableOfficersRes.json();
        setAvailableOfficers(availableData.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch("police/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stationFormData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Police station created successfully",
        });
        setIsStationDialogOpen(false);
        setStationFormData({
          name: "",
          code: "",
          district: "",
          address: "",
          contactNumber: "",
          inChargeId: "",
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to create station",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch("police/officers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(officerFormData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Police officer created successfully",
        });
        setIsOfficerDialogOpen(false);
        setOfficerFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          rank: "",
          badgeNumber: "",
          stationId: "",
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to create officer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch("police/assign-officer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignFormData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Officer assigned successfully",
        });
        setIsAssignDialogOpen(false);
        setAssignFormData({
          stationId: "",
          officerId: "",
          rank: "",
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to assign officer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const getRankIcon = (rank: string) => {
    const seniorRanks = [
      "IGP",
      "ADDITIONAL_IGP",
      "IG",
      "ADDITIONAL_IG",
      "DIG",
      "DIG_RANGE",
      "ADDITIONAL_DIG",
    ];
    const midRanks = ["SP", "ADDITIONAL_SP", "INSPECTOR"];

    if (seniorRanks.includes(rank)) {
      return <Crown className="h-4 w-4 text-yellow-600" />;
    } else if (midRanks.includes(rank)) {
      return <Star className="h-4 w-4 text-blue-600" />;
    }
    return <Shield className="h-4 w-4 text-gray-600" />;
  };

  const getRankBadge = (rank: string) => {
    const seniorRanks = [
      "IGP",
      "ADDITIONAL_IGP",
      "IG",
      "ADDITIONAL_IG",
      "DIG",
      "DIG_RANGE",
      "ADDITIONAL_DIG",
    ];
    const midRanks = ["SP", "ADDITIONAL_SP", "INSPECTOR"];

    if (seniorRanks.includes(rank)) {
      return (
        <Badge variant="default" className="bg-yellow-600">
          {rank.replace("_", " ")}
        </Badge>
      );
    } else if (midRanks.includes(rank)) {
      return (
        <Badge variant="default" className="bg-blue-600">
          {rank.replace("_", " ")}
        </Badge>
      );
    }
    return <Badge variant="secondary">{rank.replace("_", " ")}</Badge>;
  };

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      districtFilter === "all" || station.district === districtFilter;

    return matchesSearch && matchesDistrict;
  });

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch =
      `${officer.firstName} ${officer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (officer.badgeNumber &&
        officer.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRank = rankFilter === "all" || officer.rank === rankFilter;

    return matchesSearch && matchesRank;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Police Management Dashboard</h1>
          <p className="text-muted-foreground">
            Manage police stations, officers, and assignments
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stations.length}</div>
                <p className="text-xs text-muted-foreground">Police Stations</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{officers.length}</div>
                <p className="text-xs text-muted-foreground">Total Officers</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {stations.filter((s) => s.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">Active Stations</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {availableOfficers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unassigned Officers
                </p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stations">Police Stations</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="space-y-4">
          {/* Station Management Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Police Stations</h2>
            <div className="flex gap-2">
              <Dialog
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Assign Officer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAssignOfficer}>
                    <DialogHeader>
                      <DialogTitle>Assign Officer to Station</DialogTitle>
                      <DialogDescription>
                        Assign an unassigned officer to a police station.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="stationId">Police Station</Label>
                        <Select
                          value={assignFormData.stationId}
                          onValueChange={(value) =>
                            setAssignFormData({
                              ...assignFormData,
                              stationId: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a station" />
                          </SelectTrigger>
                          <SelectContent>
                            {stations.map((station) => (
                              <SelectItem key={station.id} value={station.id}>
                                {station.name} ({station.district})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officerId">Officer</Label>
                        <Select
                          value={assignFormData.officerId}
                          onValueChange={(value) =>
                            setAssignFormData({
                              ...assignFormData,
                              officerId: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an officer" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableOfficers.map((officer) => (
                              <SelectItem key={officer.id} value={officer.id}>
                                {officer.firstName} {officer.lastName} (
                                {officer.rank})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rank">Rank</Label>
                        <Select
                          value={assignFormData.rank}
                          onValueChange={(value) =>
                            setAssignFormData({
                              ...assignFormData,
                              rank: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {policeRanks.map((rank) => (
                              <SelectItem key={rank} value={rank}>
                                {rank.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Assign Officer</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isStationDialogOpen}
                onOpenChange={setIsStationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Station
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleCreateStation}>
                    <DialogHeader>
                      <DialogTitle>Create Police Station</DialogTitle>
                      <DialogDescription>
                        Add a new police station to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Station Name</Label>
                          <Input
                            id="name"
                            value={stationFormData.name}
                            onChange={(e) =>
                              setStationFormData({
                                ...stationFormData,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="code">Station Code</Label>
                          <Input
                            id="code"
                            value={stationFormData.code}
                            onChange={(e) =>
                              setStationFormData({
                                ...stationFormData,
                                code: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Select
                          value={stationFormData.district}
                          onValueChange={(value) =>
                            setStationFormData({
                              ...stationFormData,
                              district: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {bangladeshiDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={stationFormData.address}
                          onChange={(e) =>
                            setStationFormData({
                              ...stationFormData,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          type="tel"
                          value={stationFormData.contactNumber}
                          onChange={(e) =>
                            setStationFormData({
                              ...stationFormData,
                              contactNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inChargeId">Officer in Charge</Label>
                        <Select
                          value={stationFormData.inChargeId}
                          onValueChange={(value) =>
                            setStationFormData({
                              ...stationFormData,
                              inChargeId: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select officer in charge" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableOfficers.map((officer) => (
                              <SelectItem key={officer.id} value={officer.id}>
                                {officer.firstName} {officer.lastName} (
                                {officer.rank})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Station</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Station Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stations by name, code, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {bangladeshiDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stations List */}
          <div className="grid gap-4">
            {filteredStations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No police stations found
                  </p>
                  <Button
                    onClick={() => setIsStationDialogOpen(true)}
                    className="mt-4"
                  >
                    Create First Station
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredStations.map((station) => (
                <Card key={station.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {station.name}
                            {station.isActive ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Code: {station.code} • {station.district}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{station.address}</span>
                          </div>
                          {station.contactNumber && (
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <span className="text-muted-foreground">
                                Phone:
                              </span>
                              <span>{station.contactNumber}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {station.inCharge && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Officer in Charge
                              </p>
                              <div className="flex items-center gap-2">
                                {getRankIcon(station.inCharge.rank)}
                                <span className="font-medium">
                                  {station.inCharge.firstName}{" "}
                                  {station.inCharge.lastName}
                                </span>
                                {getRankBadge(station.inCharge.rank)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {station._count && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {station._count.officers} officers assigned
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="officers" className="space-y-4">
          {/* Officers Management Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Police Officers</h2>
            <Dialog
              open={isOfficerDialogOpen}
              onOpenChange={setIsOfficerDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Officer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateOfficer}>
                  <DialogHeader>
                    <DialogTitle>Create Police Officer</DialogTitle>
                    <DialogDescription>
                      Add a new police officer to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={officerFormData.firstName}
                          onChange={(e) =>
                            setOfficerFormData({
                              ...officerFormData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={officerFormData.lastName}
                          onChange={(e) =>
                            setOfficerFormData({
                              ...officerFormData,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={officerFormData.email}
                        onChange={(e) =>
                          setOfficerFormData({
                            ...officerFormData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={officerFormData.phone}
                          onChange={(e) =>
                            setOfficerFormData({
                              ...officerFormData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="badgeNumber">Badge Number</Label>
                        <Input
                          id="badgeNumber"
                          value={officerFormData.badgeNumber}
                          onChange={(e) =>
                            setOfficerFormData({
                              ...officerFormData,
                              badgeNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rank">Rank</Label>
                      <Select
                        value={officerFormData.rank}
                        onValueChange={(value) =>
                          setOfficerFormData({
                            ...officerFormData,
                            rank: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rank" />
                        </SelectTrigger>
                        <SelectContent>
                          {policeRanks.map((rank) => (
                            <SelectItem key={rank} value={rank}>
                              {rank.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stationId">
                        Assign to Station (Optional)
                      </Label>
                      <Select
                        value={officerFormData.stationId}
                        onValueChange={(value) =>
                          setOfficerFormData({
                            ...officerFormData,
                            stationId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select station (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name} ({station.district})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Officer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Officer Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search officers by name, email, or badge number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={rankFilter} onValueChange={setRankFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranks</SelectItem>
                {policeRanks.map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Officers List */}
          <div className="grid gap-4">
            {filteredOfficers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No police officers found
                  </p>
                  <Button
                    onClick={() => setIsOfficerDialogOpen(true)}
                    className="mt-4"
                  >
                    Create First Officer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredOfficers.map((officer) => (
                <Card key={officer.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {officer.firstName.charAt(0)}
                          {officer.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getRankIcon(officer.rank)}
                          <h3 className="font-semibold">
                            {officer.firstName} {officer.lastName}
                          </h3>
                          {getRankBadge(officer.rank)}
                          {officer.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p>{officer.email}</p>
                            {officer.phone && <p>{officer.phone}</p>}
                          </div>
                          <div>
                            {officer.station ? (
                              <div>
                                <p className="text-muted-foreground">
                                  Assigned Station
                                </p>
                                <p>{officer.station.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {officer.station.district}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge
                                  variant="outline"
                                  className="text-yellow-600"
                                >
                                  Unassigned
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        {officer.badgeNumber && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Badge:{" "}
                            </span>
                            <span className="font-medium">
                              {officer.badgeNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
