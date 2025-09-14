"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

interface WatchlistPreviewProps {
  watchlists: Watchlist[];
}

// Mock data for stock prices - in a real app, this would come from an API
const mockPrices: Record<string, { price: number, change: number, changePercent: number }> = {
  "AAPL": { price: 175.42, change: 2.35, changePercent: 1.36 },
  "MSFT": { price: 338.11, change: -1.23, changePercent: -0.36 },
  "GOOGL": { price: 134.99, change: 0.87, changePercent: 0.65 },
  "AMZN": { price: 145.68, change: -2.14, changePercent: -1.45 },
  "TSLA": { price: 248.50, change: 5.30, changePercent: 2.18 },
  "META": { price: 327.82, change: 4.23, changePercent: 1.31 },
  "NVDA": { price: 437.53, change: 12.45, changePercent: 2.93 },
  "BRK.B": { price: 352.66, change: -0.54, changePercent: -0.15 },
  "JPM": { price: 152.82, change: 1.23, changePercent: 0.81 },
  "V": { price: 267.94, change: 0.32, changePercent: 0.12 },
};

// Add some default items if the watchlist is empty
const getDefaultItems = (): WatchlistItem[] => [
  { id: "default-1", symbol: "AAPL", name: "Apple Inc." },
  { id: "default-2", symbol: "MSFT", name: "Microsoft Corporation" },
  { id: "default-3", symbol: "GOOGL", name: "Alphabet Inc." },
  { id: "default-4", symbol: "AMZN", name: "Amazon.com, Inc." },
  { id: "default-5", symbol: "TSLA", name: "Tesla, Inc." },
];

export function WatchlistPreview({ watchlists }: WatchlistPreviewProps) {
  const [activeWatchlist, setActiveWatchlist] = useState(
    watchlists.length > 0 ? watchlists[0].id : "default"
  );

  // If no watchlists or all watchlists are empty, show default items
  const currentWatchlist = watchlists.find(w => w.id === activeWatchlist);
  const items = currentWatchlist?.items.length 
    ? currentWatchlist.items 
    : getDefaultItems();

  return (
    <div className="space-y-4">
      {watchlists.length > 1 && (
        <Tabs value={activeWatchlist} onValueChange={setActiveWatchlist}>
          <TabsList className="w-full">
            {watchlists.map((watchlist) => (
              <TabsTrigger
                key={watchlist.id}
                value={watchlist.id}
                className="flex-1"
              >
                {watchlist.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const priceData = mockPrices[item.symbol] || { 
            price: 100 + Math.random() * 200, 
            change: (Math.random() - 0.5) * 10, 
            changePercent: (Math.random() - 0.5) * 5 
          };
          
          const isPositive = priceData.change >= 0;
          
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <p className="font-medium">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${priceData.price.toFixed(2)}</p>
                <div className="flex items-center justify-end">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{priceData.change.toFixed(2)} ({isPositive ? "+" : ""}{priceData.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center">
        <Link href="/dashboard/watchlist">
          <Button variant="outline" size="sm">View Full Watchlist</Button>
        </Link>
      </div>
    </div>
  );
}
