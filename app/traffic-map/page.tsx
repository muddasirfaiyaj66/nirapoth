"use client";

import { useEffect, useState } from "react";
import TrafficSafetyMap from "@/components/maps/TrafficSafetyMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Car, Shield, MapPin, TrendingUp } from "lucide-react";

export default function PublicTrafficMapPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  // Check if user is logged in
  useEffect(() => {
    // Check for auth token/cookie
    const checkAuth = () => {
      // Implement your auth check logic
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        // Get user ID from token or API
        // setUserId(getUserIdFromToken(token));
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-10 w-10" />
            <h1 className="text-4xl font-bold">
              NiraPoth Live Traffic Monitor
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-3xl">
            Real-time traffic updates, accident warnings, and smart route
            planning to keep you safe on the road. Always free, no login
            required.
          </p>
          <div className="flex gap-3 mt-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Shield className="h-4 w-4 mr-1" />
              Public Safety Feature
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <MapPin className="h-4 w-4 mr-1" />
              10km Radius Coverage
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI-Powered Predictions
            </Badge>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 dark:bg-red-950 p-3 rounded-lg">
                  <Car className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Live Traffic Jams</h3>
                  <p className="text-sm text-muted-foreground">
                    See all traffic jams within 10km, with delay estimates and
                    affected road lengths.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-950 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accident Hotspots</h3>
                  <p className="text-sm text-muted-foreground">
                    Historical accident data warns you about dangerous roads
                    before you travel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-950 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Routes</h3>
                  <p className="text-sm text-muted-foreground">
                    Get fastest routes avoiding traffic jams and high-accident
                    areas automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Map Component */}
        <TrafficSafetyMap
          height="700px"
          isAuthenticated={isAuthenticated}
          userId={userId}
        />

        {/* How It Works */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-semibold mb-1">
                    Share Your Location (Optional)
                  </h3>
                  <p className="text-muted-foreground">
                    Allow location access to see nearby traffic jams and
                    accident zones within 10km radius.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold mb-1">View Live Traffic Data</h3>
                  <p className="text-muted-foreground">
                    Red markers show traffic jams with severity levels. Yellow
                    markers warn about accident-prone areas.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Search Destination</h3>
                  <p className="text-muted-foreground">
                    Enter where you want to go, and we'll calculate the safest
                    and fastest route.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Choose Your Route</h3>
                  <p className="text-muted-foreground">
                    Compare routes with safety scores, traffic warnings, and
                    accident history alerts.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="mt-8 bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Safety Reminders
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Always follow traffic rules and speed limits</li>
                  <li>Extra caution required in marked accident zones</li>
                  <li>Traffic data updates every few minutes</li>
                  <li>Report accidents or traffic jams to help others</li>
                  <li>Use hands-free mode - Don't use phone while driving</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
