"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RewardsChartProps {
  data: Array<{
    month: string;
    rewards: number;
    penalties: number;
    net: number;
  }>;
}

export function RewardsChart({ data }: RewardsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Rewards and penalties over time
        </p>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
                formatter={(value: number) => `৳${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rewards"
                stroke="#22c55e"
                strokeWidth={2}
                name="Rewards Earned"
              />
              <Line
                type="monotone"
                dataKey="penalties"
                stroke="#ef4444"
                strokeWidth={2}
                name="Penalties"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Net Balance"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No rewards data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
