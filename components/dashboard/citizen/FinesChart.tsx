"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinesChartProps {
  data: Array<{
    month: string;
    total: number;
    paid: number;
    unpaid: number;
  }>;
}

export function FinesChart({ data }: FinesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fines Analytics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total, paid, and unpaid fines over time
        </p>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
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
              <Bar dataKey="total" fill="#94a3b8" name="Total Fines" />
              <Bar dataKey="paid" fill="#22c55e" name="Paid" />
              <Bar dataKey="unpaid" fill="#ef4444" name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No fines data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
