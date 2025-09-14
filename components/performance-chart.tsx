"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Sample data - in a real app, this would come from the API
const generateSampleData = (days: number) => {
  const data = [];
  const today = new Date();
  let value = 10000;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to simulate market fluctuations
    const change = (Math.random() - 0.5) * 200;
    value += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(value, 100), // Ensure value doesn't go below 100
    });
  }
  
  return data;
};

const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "All", days: 730 },
];

export function PerformanceChart() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[1]); // Default to 1M
  const data = generateSampleData(selectedRange.days);
  
  const startValue = data[0]?.value || 0;
  const endValue = data[data.length - 1]?.value || 0;
  const change = endValue - startValue;
  const percentChange = (change / startValue) * 100;
  
  const isPositive = change >= 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardContent className="p-3">
            <p className="font-medium">{label}</p>
            <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(endValue)}</p>
          <div className="flex items-center">
            <span className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}{formatCurrency(change)} ({isPositive ? "+" : ""}{percentChange.toFixed(2)}%)
            </span>
            <span className="text-muted-foreground ml-2">
              {selectedRange.label}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant={selectedRange.label === range.label ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              tick={{ fontSize: 12 }}
              tickCount={5}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              tick={{ fontSize: 12 }}
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
