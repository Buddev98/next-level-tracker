"use client";

import Link from "next/link";
import { formatCurrency, formatDate, calculateROI } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice: number | null;
  portfolioId: string;
}

interface InvestmentListProps {
  investments: Investment[];
}

export function InvestmentList({ investments }: InvestmentListProps) {
  if (!investments || investments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">You don't have any investments yet</p>
        <Link href="/dashboard/investments/new">
          <Button>Add Your First Investment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Purchase Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => {
            const currentPrice = investment.currentPrice || investment.purchasePrice;
            const marketValue = currentPrice * investment.quantity;
            const costBasis = investment.purchasePrice * investment.quantity;
            const gainLoss = marketValue - costBasis;
            const roi = calculateROI(marketValue, costBasis);
            const isPositive = gainLoss >= 0;

            return (
              <TableRow key={investment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{investment.symbol}</p>
                    <p className="text-xs text-muted-foreground">{investment.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {investment.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">{investment.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(investment.purchasePrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(currentPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(marketValue)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {formatCurrency(gainLoss)} ({roi.toFixed(2)}%)
                    </span>
                  </div>
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
                        <Link href={`/dashboard/investments/${investment.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/investments/${investment.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/transactions/new?investmentId=${investment.id}`}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Add Transaction
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
  );
}
