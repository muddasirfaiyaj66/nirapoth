"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api/apiClient";
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Admin button to populate BD geographical data
 * Only accessible by ADMIN and SUPER_ADMIN roles
 *
 * Place this in your admin dashboard
 */
export function PopulateBDGeoDataButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const handlePopulate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await api.post("/bd-geo/populate");

      setResult({
        success: true,
        message: "Geographical data populated successfully!",
      });

      toast({
        title: "Success",
        description: "BD geographical data has been populated in the database.",
      });

      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setResult(null);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to populate geographical data";

      setResult({
        success: false,
        message: errorMessage,
      });

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Database className="h-4 w-4" />
          Populate BD Geo Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Populate Bangladesh Geographical Data</DialogTitle>
          <DialogDescription>
            This will fetch and store divisions, districts, and upazilas from
            the BD API into your database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">What this does:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Fetches 8 divisions</li>
                  <li>Fetches 64 districts</li>
                  <li>Fetches 494 upazilas</li>
                  <li>Stores all data in your database</li>
                </ul>
                <p className="text-sm mt-2">
                  This is safe to run multiple times. It will update existing
                  data without creating duplicates.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handlePopulate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Populating...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Populate Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Display current BD Geo data statistics
 * Shows counts of divisions, districts, and upazilas
 */
export function BDGeoDataStats() {
  const [stats, setStats] = useState<{
    divisions: number;
    districts: number;
    upazilas: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [divisions, districts, upazilas] = await Promise.all([
        api.get("/bd-geo/divisions"),
        api.get("/bd-geo/districts"),
        api.get("/bd-geo/upazilas"),
      ]);

      setStats({
        divisions: divisions.data.data.length,
        districts: districts.data.data.length,
        upazilas: upazilas.data.data.length,
      });
    } catch (error) {
      console.error("Failed to fetch BD Geo stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading statistics...
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load BD Geo data statistics. The database might be empty.
        </AlertDescription>
      </Alert>
    );
  }

  const isComplete =
    stats.divisions === 8 && stats.districts === 64 && stats.upazilas === 494;

  return (
    <Alert variant={isComplete ? "default" : "destructive"}>
      {isComplete ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Bangladesh Geographical Data Status:</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Divisions</p>
              <p
                className={`font-semibold ${
                  stats.divisions === 8 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.divisions} / 8
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Districts</p>
              <p
                className={`font-semibold ${
                  stats.districts === 64 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.districts} / 64
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Upazilas</p>
              <p
                className={`font-semibold ${
                  stats.upazilas === 494 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.upazilas} / 494
              </p>
            </div>
          </div>
          {!isComplete && (
            <p className="text-sm mt-2">
              ⚠️ Database is incomplete. Click "Populate BD Geo Data" to fix
              this.
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Complete admin panel section for BD Geo Data management
 * Include this in your admin dashboard
 */
export function BDGeoDataManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Bangladesh Geographical Data</h3>
          <p className="text-sm text-muted-foreground">
            Manage divisions, districts, and upazilas for address selection
          </p>
        </div>
        <PopulateBDGeoDataButton />
      </div>

      <BDGeoDataStats />
    </div>
  );
}
