"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Car } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: "fine" | "reward";
  description: string;
  amount: number;
  status: string;
  date: Date;
  vehicle?: string;
}

interface RecentActivityListProps {
  data: Activity[];
}

export function RecentActivityList({ data }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest fines and rewards
        </p>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "fine"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {activity.type === "fine" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.vehicle && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Car className="h-3 w-3" />
                          <span>{activity.vehicle}</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`font-semibold text-sm ${
                      activity.type === "fine"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {activity.type === "fine" ? "-" : "+"}৳
                    {Math.abs(activity.amount).toLocaleString()}
                  </span>
                  <Badge
                    variant={
                      activity.status === "PAID" ||
                      activity.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
