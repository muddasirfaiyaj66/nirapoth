"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  AlertTriangle,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";
import { GOOGLE_MAPS_CONFIG } from "@/lib/config/maps";

export default function MapsPage() {
  // Use API key from config file
  const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_CONFIG.apiKey;
  const [destination, setDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [trafficAlert, setTrafficAlert] = useState<{
    show: boolean;
    message: string;
    alternateRoute: string;
  } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    trafficLevel: "low" | "moderate" | "heavy";
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation({ lat: 23.8103, lng: 90.4125 }); // Default to Dhaka
        }
      );
    } else {
      setCurrentLocation({ lat: 23.8103, lng: 90.4125 }); // Default to Dhaka
    }
  }, []);

  useEffect(() => {
    console.log(
      "Checking API Key:",
      GOOGLE_MAPS_API_KEY ? "Found" : "Not Found"
    );
    console.log("API Key value:", GOOGLE_MAPS_API_KEY);

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key not found in environment variables.");
      console.error(
        "Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in .env.local"
      );
      return;
    }

    if (
      !window.google &&
      !document.querySelector('script[src*="maps.googleapis.com"]')
    ) {
      const script = document.createElement("script");
      // Note: 'directions' and 'geocoding' are included by default, only 'places' needs to be specified
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error("Failed to load Google Maps API.");
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, [GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (mapLoaded && currentLocation && mapRef.current && !map) {
      initializeMap();
    }
  }, [mapLoaded, currentLocation, map]);

  const initializeMap = () => {
    if (
      !window.google ||
      !currentLocation ||
      !mapRef.current ||
      !destinationInputRef.current
    )
      return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: currentLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
    });
    setMap(mapInstance);

    const renderer = new window.google.maps.DirectionsRenderer();
    renderer.setMap(mapInstance);
    setDirectionsRenderer(renderer);

    const autocomplete = new window.google.maps.places.Autocomplete(
      destinationInputRef.current,
      {
        componentRestrictions: { country: "bd" },
        fields: ["formatted_address", "geometry", "name"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setDestination(place.formatted_address);
      }
    });
  };

  const calculateRoute = () => {
    if (
      !window.google ||
      !currentLocation ||
      !destination.trim() ||
      !map ||
      !directionsRenderer
    ) {
      setTrafficAlert({
        show: true,
        message: "Please enter a valid destination.",
        alternateRoute: "",
      });
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng
        ),
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && response) {
          directionsRenderer.setDirections(response);
          const route = response.routes[0].legs[0];
          if (route.distance && route.duration) {
            setRouteInfo({
              distance: route.distance.text,
              duration: route.duration.text,
              trafficLevel: "moderate", // Placeholder
            });
            setTrafficAlert(null);
          }
        } else {
          console.error("Directions request failed due to " + status);
          setTrafficAlert({
            show: true,
            message:
              "Could not calculate the route. Please try a different destination.",
            alternateRoute: "",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Traffic Navigation</h1>
          <p className="text-muted-foreground">
            Real-time traffic monitoring and route optimization
          </p>
        </div>

        {!GOOGLE_MAPS_API_KEY && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Google Maps API key is not configured. Please set
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Find Your Route
                </CardTitle>
                <CardDescription>
                  Enter your destination to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Current Location
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {currentLocation
                        ? `${currentLocation.lat.toFixed(
                            4
                          )}, ${currentLocation.lng.toFixed(4)}`
                        : "Detecting..."}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="destination" className="text-sm font-medium">
                    Destination
                  </label>
                  <Input
                    id="destination"
                    ref={destinationInputRef}
                    placeholder="Enter destination address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && calculateRoute()}
                  />
                </div>

                <Button
                  onClick={calculateRoute}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {routeInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Distance
                    </span>
                    <span className="font-semibold">{routeInfo.distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Estimated Time
                    </span>
                    <span className="font-semibold">{routeInfo.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Traffic Level
                    </span>
                    <Badge
                      variant={
                        routeInfo.trafficLevel === "low"
                          ? "default"
                          : routeInfo.trafficLevel === "moderate"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {routeInfo.trafficLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {trafficAlert && trafficAlert.show && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alert</AlertTitle>
                <AlertDescription>{trafficAlert.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="h-[600px] lg:h-[calc(100vh-12rem)]">
              <CardContent className="p-0 h-full relative">
                <div
                  ref={mapRef}
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: "500px" }}
                />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Loading map...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
