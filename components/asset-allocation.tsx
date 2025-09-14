"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface AssetAllocationProps {
  data: {
    name: string;
    value: number;
    percentage: number;
  }[];
  detailed?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AssetAllocation({ data, detailed = false }: AssetAllocationProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No asset allocation data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card>
          <CardContent className="p-3">
            <p className="font-medium">{data.name}</p>
            <p className="text-muted-foreground">{formatCurrency(data.value)}</p>
            <p className="text-muted-foreground">{formatPercentage(data.percentage)}</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className={detailed ? "h-[400px]" : "h-[250px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={detailed ? 150 : 80}
            innerRadius={detailed ? 60 : 40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percentage }) => `${name} (${formatPercentage(percentage)})`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {detailed && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      
      {!detailed && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs truncate">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
