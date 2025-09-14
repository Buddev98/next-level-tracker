"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search, TrendingUp, TrendingDown, Star, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface WatchlistDetailProps {
  watchlist: Watchlist;
}

// Mock data for stock prices - in a real app, this would come from an API
const mockPrices: Record<string, { price: number, change: number, changePercent: number, volume: number, marketCap: number }> = {
  "AAPL": { price: 175.42, change: 2.35, changePercent: 1.36, volume: 58432100, marketCap: 2750000000000 },
  "MSFT": { price: 338.11, change: -1.23, changePercent: -0.36, volume: 22145600, marketCap: 2520000000000 },
  "GOOGL": { price: 134.99, change: 0.87, changePercent: 0.65, volume: 18765400, marketCap: 1720000000000 },
  "AMZN": { price: 145.68, change: -2.14, changePercent: -1.45, volume: 32654700, marketCap: 1510000000000 },
  "TSLA": { price: 248.50, change: 5.30, changePercent: 2.18, volume: 45876300, marketCap: 790000000000 },
  "META": { price: 327.82, change: 4.23, changePercent: 1.31, volume: 19876500, marketCap: 840000000000 },
  "NVDA": { price: 437.53, change: 12.45, changePercent: 2.93, volume: 38765400, marketCap: 1080000000000 },
  "BRK.B": { price: 352.66, change: -0.54, changePercent: -0.15, volume: 3456700, marketCap: 650000000000 },
  "JPM": { price: 152.82, change: 1.23, changePercent: 0.81, volume: 8765400, marketCap: 440000000000 },
  "V": { price: 267.94, change: 0.32, changePercent: 0.12, volume: 6543200, marketCap: 550000000000 },
};

// Add some default items if the watchlist is empty
const getDefaultItems = (): WatchlistItem[] => [
  { id: "default-1", symbol: "AAPL", name: "Apple Inc." },
  { id: "default-2", symbol: "MSFT", name: "Microsoft Corporation" },
  { id: "default-3", symbol: "GOOGL", name: "Alphabet Inc." },
  { id: "default-4", symbol: "AMZN", name: "Amazon.com, Inc." },
  { id: "default-5", symbol: "TSLA", name: "Tesla, Inc." },
];

export function WatchlistDetail({ watchlist }: WatchlistDetailProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // If watchlist is empty, show default items
  const items = watchlist.items.length ? watchlist.items : getDefaultItems();
  
  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols or names..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/dashboard/watchlist/add">
          <Button>Add Security</Button>
        </Link>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No securities found</p>
          <Link href="/dashboard/watchlist/add">
            <Button>Add Securities to Watchlist</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const priceData = mockPrices[item.symbol] || { 
                  price: 100 + Math.random() * 200, 
                  change: (Math.random() - 0.5) * 10, 
                  changePercent: (Math.random() - 0.5) * 5,
                  volume: Math.floor(Math.random() * 50000000),
                  marketCap: Math.floor(Math.random() * 1000000000000)
                };
                
                const isPositive = priceData.change >= 0;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.name}</TableCell>
                    <TableCell className="text-right">${priceData.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={isPositive ? "text-green-500" : "text-red-500"}>
                          {isPositive ? "+" : ""}{priceData.change.toFixed(2)} ({isPositive ? "+" : ""}{priceData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(priceData.volume / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right">
                      ${(priceData.marketCap / 1000000000).toFixed(2)}B
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/investments/new?symbol=${item.symbol}`}>
                              <Star className="mr-2 h-4 w-4" />
                              Add to Portfolio
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from Watchlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
