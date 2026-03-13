"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-foreground/10 flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-brand-beige font-semibold font-heading text-lg">
          Rs. {payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: { data: { name: string; revenue: number }[] }) {
  // If no data provided, use some sensible defaults or empty state
  const chartData = data && data.length > 0 ? data : [
    { name: "Jan", revenue: 0 },
    { name: "Feb", revenue: 0 },
    { name: "Mar", revenue: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EED9C4" opacity={0.3} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#3B2F2F", opacity: 0.6, fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#3B2F2F", opacity: 0.6, fontSize: 12 }}
          tickFormatter={(value) => `Rs. ${value.toLocaleString("en-IN")}`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#EED9C4", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3B2F2F"
          strokeWidth={3}
          dot={{ fill: "#F5E6DA", stroke: "#3B2F2F", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#EED9C4", stroke: "#3B2F2F" }}
          animationDuration={2000}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
