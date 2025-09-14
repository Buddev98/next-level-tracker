"use client";

import Link from "next/link";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  totalValue: number;
  totalCost: number;
  roi: number;
  investments: any[];
}

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export function PortfolioList({ portfolios }: PortfolioListProps) {
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">You don't have any portfolios yet</p>
        <Link href="/dashboard/portfolio/new">
          <Button>Create Your First Portfolio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Investments</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolios.map((portfolio) => (
            <TableRow key={portfolio.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/portfolio/${portfolio.id}`} className="hover:underline">
                  {portfolio.name}
                </Link>
                {portfolio.description && (
                  <p className="text-xs text-muted-foreground">{portfolio.description}</p>
                )}
              </TableCell>
              <TableCell>{portfolio.investments.length}</TableCell>
              <TableCell className="text-right">{formatCurrency(portfolio.totalValue)}</TableCell>
              <TableCell className="text-right">{formatCurrency(portfolio.totalCost)}</TableCell>
              <TableCell className={`text-right ${portfolio.roi >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(portfolio.roi)}
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
                      <Link href={`/dashboard/portfolio/${portfolio.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/portfolio/${portfolio.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
