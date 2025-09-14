"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  price: number;
  date: Date;
  investment: {
    symbol: string;
    name: string;
  };
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground mb-4">No recent transactions</p>
        <Link href="/dashboard/transactions/new">
          <Button>Add Transaction</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
          >
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                transaction.type === "buy" ? "bg-green-500/10" : "bg-red-500/10"
              }`}>
                {transaction.type === "buy" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.investment.symbol}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {transaction.type === "buy" ? "+" : "-"}
                {transaction.quantity} shares
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(transaction.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Link href="/dashboard/transactions">
          <Button variant="outline" size="sm">View All Transactions</Button>
        </Link>
      </div>
    </div>
  );
}
