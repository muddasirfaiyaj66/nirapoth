"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ViolationsChartProps {
  data: Array<{ month: string; count: number }>;
}

export function ViolationsChart({ data }: ViolationsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Violations Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 6 months violation trend
        </p>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="colorViolations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorViolations)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No violation data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
