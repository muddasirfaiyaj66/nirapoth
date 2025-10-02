"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
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
import { useToast } from "@/components/ui/use-toast";

function AutocompleteComponent({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    // Use 'any' to bypass the missing type definition for PlaceAutocompleteElement
    const autocompleteElement = new (places as any).PlaceAutocompleteElement({
      inputElement: inputRef.current,
      componentRestrictions: { country: "bd" },
    });

    // The event from the web component is a standard CustomEvent
    const handlePlaceSelect = (event: Event) => {
      // The place result is in the 'place' property of the event for 'gmp-placeselect'
      const place = (event as any).place as google.maps.places.PlaceResult;
      onPlaceSelect(place);
    };

    // Cast the autocomplete element to add the event listener
    const acElement = autocompleteElement as unknown as HTMLElement;
    acElement.addEventListener("gmp-placeselect", handlePlaceSelect);

    // Cleanup by removing the event listener
    return () => {
      acElement.removeEventListener("gmp-placeselect", handlePlaceSelect);
    };
  }, [places, onPlaceSelect]);

  return (
    <Input
      id="destination"
      ref={inputRef}
      placeholder="Enter destination address"
    />
  );
}

export default function MapsPage() {
  const [destination, setDestination] = useState("");
  const [destinationPlace, setDestinationPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
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
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

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

  const onPlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult | null) => {
      setDestinationPlace(place);
      if (place?.formatted_address) {
        setDestination(place.formatted_address);
      }
    },
    []
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Google Maps API key is not configured. 
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Traffic Navigation</h1>
            <p className="text-muted-foreground">
              Real-time traffic monitoring and route optimization
            </p>
          </div>

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
                    <label
                      htmlFor="destination"
                      className="text-sm font-medium"
                    >
                      Destination
                    </label>
                    <AutocompleteComponent onPlaceSelect={onPlaceSelect} />
                  </div>

                  <Button
                    onClick={() => {
                      /* calculateRoute logic will be handled by Directions component */
                    }}
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
                      <span className="font-semibold">
                        {routeInfo.distance}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Estimated Time
                      </span>
                      <span className="font-semibold">
                        {routeInfo.duration}
                      </span>
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
                  {currentLocation && (
                    <Map
                      defaultCenter={currentLocation}
                      defaultZoom={13}
                      mapId="nirapod-poth-map"
                    >
                      <Directions
                        destination={destinationPlace}
                        currentLocation={currentLocation}
                        setRouteInfo={setRouteInfo}
                        setTrafficAlert={setTrafficAlert}
                      />
                    </Map>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

function Directions({
  destination,
  currentLocation,
  setRouteInfo,
  setTrafficAlert,
}: {
  destination: google.maps.places.PlaceResult | null;
  currentLocation: { lat: number; lng: number };
  setRouteInfo: (info: any) => void;
  setTrafficAlert: (alert: any) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !destination) return;

    directionsService
      .route({
        origin: new google.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng
        ),
        destination: destination.geometry?.location!,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        const route = response.routes[0].legs[0];
        if (route.distance && route.duration) {
          setRouteInfo({
            distance: route.distance.text,
            duration: route.duration.text,
            trafficLevel: "moderate", // Placeholder
          });
          setTrafficAlert(null);
        }
      })
      .catch((e) => {
        console.error("Directions request failed", e);
        setTrafficAlert({
          show: true,
          message:
            "Could not calculate the route. Please try a different destination.",
          alternateRoute: "",
        });
      });
  }, [
    directionsService,
    directionsRenderer,
    destination,
    currentLocation,
    setRouteInfo,
    setTrafficAlert,
  ]);

  return null;
}
