"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Briefcase, LineChart } from "lucide-react";

interface PortfolioSummaryProps {
  portfolioValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  portfolioCount: number;
  investmentCount: number;
}

export function PortfolioSummary({
  portfolioValue,
  totalGainLoss,
  totalGainLossPercentage,
  portfolioCount,
  investmentCount,
}: PortfolioSummaryProps) {
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </p>
              <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              isPositive ? "bg-green-500/10" : "bg-red-500/10"
            }`}>
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Gain/Loss
              </p>
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {formatCurrency(totalGainLoss)}
                </p>
                <span className={`ml-2 text-sm ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {formatPercentage(totalGainLossPercentage)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Portfolios
              </p>
              <p className="text-2xl font-bold">{portfolioCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Investments
              </p>
              <p className="text-2xl font-bold">{investmentCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
