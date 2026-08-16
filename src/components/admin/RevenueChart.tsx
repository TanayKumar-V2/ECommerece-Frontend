"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-foreground/10 flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-muted font-semibold font-heading text-lg">
           ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: { data: { name: string; revenue: number }[] }) {
  // Keep the chart frame stable when there is no revenue yet.
  const chartData = data && data.length > 0 ? data : [
    { name: "Jan", revenue: 0 },
    { name: "Feb", revenue: 0 },
    { name: "Mar", revenue: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" opacity={0.5} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
           tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "var(--chart-grid)", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--chart-line)"
          strokeWidth={3}
          dot={{ fill: "var(--chart-fill)", stroke: "var(--chart-line)", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "var(--brand-beige)", stroke: "var(--chart-line)" }}
          animationDuration={2000}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
