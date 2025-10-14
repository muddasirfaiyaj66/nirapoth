"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Flame,
  Heart,
  MapPin,
  Clock,
  Eye,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";

interface EmergencyIncident {
  id: string;
  type: "accident" | "fire" | "medical";
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "detected" | "responding" | "resolved";
  description: string;
}

export function LiveEmergencyResponse() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time emergency data
    const generateMockIncidents = () => {
      const incidentTypes: EmergencyIncident["type"][] = [
        "accident",
        "fire",
        "medical",
      ];
      const locations = [
        "Gulshan Avenue, Dhaka",
        "Dhanmondi 27, Dhaka",
        "Uttara Sector 7, Dhaka",
        "Banani, Dhaka",
        "Mohammadpur, Dhaka",
      ];
      const severities: EmergencyIncident["severity"][] = [
        "low",
        "medium",
        "high",
        "critical",
      ];

      const mockIncidents: EmergencyIncident[] = [
        {
          id: "1",
          type: "accident",
          location: locations[Math.floor(Math.random() * locations.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(
            Date.now() - Math.random() * 3600000
          ).toISOString(),
          status: "detected",
          description: "Vehicle collision detected on main road",
        },
        {
          id: "2",
          type: "fire",
          location: locations[Math.floor(Math.random() * locations.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(
            Date.now() - Math.random() * 1800000
          ).toISOString(),
          status: "responding",
          description: "Building fire reported in commercial area",
        },
        {
          id: "3",
          type: "medical",
          location: locations[Math.floor(Math.random() * locations.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(
            Date.now() - Math.random() * 900000
          ).toISOString(),
          status: "detected",
          description: "Medical emergency requiring immediate attention",
        },
      ];

      setIncidents(mockIncidents);
    };

    generateMockIncidents();
    const interval = setInterval(generateMockIncidents, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIncidentIcon = (type: EmergencyIncident["type"]) => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="h-5 w-5 text-green-600" />;
      case "fire":
        return <Flame className="h-5 w-5 text-orange-600" />;
      case "medical":
        return <Heart className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: EmergencyIncident["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: EmergencyIncident["status"]) => {
    switch (status) {
      case "detected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "responding":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - incidentTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Live Emergency Response
            <Badge variant="destructive" className="animate-pulse">
              Live
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-red-500" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm text-muted-foreground">
              {isLive ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No active emergencies detected
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getIncidentIcon(incident.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium capitalize">
                        {incident.type} Detected
                      </h4>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(incident.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
