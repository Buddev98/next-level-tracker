import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage, calculateROI } from "@/lib/utils";
import { Plus } from "lucide-react";
import { PortfolioList } from "@/components/portfolio-list";
import { InvestmentList } from "@/components/investment-list";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user's portfolios
  const portfolios = await prisma.portfolio.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      investments: true,
    },
  });

  // Calculate portfolio metrics
  const portfolioMetrics = portfolios.map(portfolio => {
    const totalValue = portfolio.investments.reduce((sum, investment) => {
      const currentValue = investment.currentPrice 
        ? investment.currentPrice * investment.quantity 
        : investment.purchasePrice * investment.quantity;
      return sum + currentValue;
    }, 0);

    const totalCost = portfolio.investments.reduce((sum, investment) => {
      return sum + (investment.purchasePrice * investment.quantity);
    }, 0);

    const roi = calculateROI(totalValue, totalCost);

    return {
      ...portfolio,
      totalValue,
      totalCost,
      roi,
    };
  });

  // Calculate overall metrics
  const overallValue = portfolioMetrics.reduce((sum, p) => sum + p.totalValue, 0);
  const overallCost = portfolioMetrics.reduce((sum, p) => sum + p.totalCost, 0);
  const overallRoi = calculateROI(overallValue, overallCost);

  // Get all investments across portfolios
  const allInvestments = portfolios.flatMap(p => p.investments);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/portfolio/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Portfolio
            </Button>
          </Link>
          <Link href="/dashboard/investments/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>Overview of your investment portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(overallValue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(overallCost)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall ROI</p>
                <p className={`text-2xl font-bold ${overallRoi >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatPercentage(overallRoi)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="portfolios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolios">
            <Card>
              <CardHeader>
                <CardTitle>Your Portfolios</CardTitle>
                <CardDescription>Manage your investment portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioList portfolios={portfolioMetrics} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
                <CardDescription>All investments across portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <InvestmentList investments={allInvestments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
