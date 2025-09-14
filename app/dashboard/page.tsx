import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { AssetAllocation } from "@/components/asset-allocation";
import { PerformanceChart } from "@/components/performance-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { WatchlistPreview } from "@/components/watchlist-preview";

export default async function DashboardPage() {
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

  // Fetch recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      investment: {
        portfolio: {
          userId: session.user.id as string,
        },
      },
    },
    include: {
      investment: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  // Fetch watchlist items
  const watchlists = await prisma.watchlist.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      items: true,
    },
  });

  // Calculate portfolio value and other metrics
  const portfolioValue = portfolios.reduce((total, portfolio) => {
    const portfolioTotal = portfolio.investments.reduce((sum, investment) => {
      const currentValue = investment.currentPrice 
        ? investment.currentPrice * investment.quantity 
        : investment.purchasePrice * investment.quantity;
      return sum + currentValue;
    }, 0);
    return total + portfolioTotal;
  }, 0);

  // Calculate total cost basis
  const costBasis = portfolios.reduce((total, portfolio) => {
    const portfolioCost = portfolio.investments.reduce((sum, investment) => {
      return sum + (investment.purchasePrice * investment.quantity);
    }, 0);
    return total + portfolioCost;
  }, 0);

  // Calculate total gain/loss
  const totalGainLoss = portfolioValue - costBasis;
  const totalGainLossPercentage = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;

  // Prepare asset allocation data
  const assetAllocation = portfolios.flatMap(portfolio => 
    portfolio.investments.map(investment => ({
      type: investment.type,
      value: investment.currentPrice 
        ? investment.currentPrice * investment.quantity 
        : investment.purchasePrice * investment.quantity,
    }))
  ).reduce((acc, { type, value }) => {
    acc[type] = (acc[type] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const assetAllocationData = Object.entries(assetAllocation).map(([name, value]) => ({
    name,
    value,
    percentage: (value / portfolioValue) * 100,
  }));

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6">
        <PortfolioSummary 
          portfolioValue={portfolioValue}
          totalGainLoss={totalGainLoss}
          totalGainLossPercentage={totalGainLossPercentage}
          portfolioCount={portfolios.length}
          investmentCount={portfolios.reduce((sum, p) => sum + p.investments.length, 0)}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>Distribution of your investments by asset type</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssetAllocation data={assetAllocationData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest investment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions transactions={recentTransactions} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>Securities you're monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <WatchlistPreview watchlists={watchlists} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Track your investment growth over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <PerformanceChart />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Asset Allocation</CardTitle>
                <CardDescription>Breakdown of your portfolio by asset classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <AssetAllocation data={assetAllocationData} detailed />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
