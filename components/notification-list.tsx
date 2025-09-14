"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, Check, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationListProps {
  notifications: Notification[];
}

// Generate sample notifications if none exist
const getSampleNotifications = (): Notification[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  return [
    {
      id: "sample-1",
      type: "price_alert",
      message: "AAPL has increased by 5% today",
      read: false,
      createdAt: now,
    },
    {
      id: "sample-2",
      type: "portfolio_change",
      message: "Your portfolio value has increased by 2.3% this week",
      read: false,
      createdAt: yesterday,
    },
    {
      id: "sample-3",
      type: "dividend",
      message: "You received a dividend payment of $45.20 from MSFT",
      read: true,
      createdAt: twoDaysAgo,
    },
    {
      id: "sample-4",
      type: "price_alert",
      message: "TSLA has dropped by 3.5% today",
      read: true,
      createdAt: twoDaysAgo,
    },
    {
      id: "sample-5",
      type: "system",
      message: "Your portfolio data has been updated successfully",
      read: true,
      createdAt: twoDaysAgo,
    },
  ];
};

export function NotificationList({ notifications }: NotificationListProps) {
  const [readState, setReadState] = useState<Record<string, boolean>>({});
  
  // Use sample notifications if none provided
  const allNotifications = notifications.length > 0 
    ? notifications 
    : getSampleNotifications();
  
  const markAsRead = (id: string) => {
    setReadState(prev => ({ ...prev, [id]: true }));
    // In a real app, you would also update the server
  };
  
  const markAllAsRead = () => {
    const newState: Record<string, boolean> = {};
    allNotifications.forEach(notification => {
      newState[notification.id] = true;
    });
    setReadState(newState);
    // In a real app, you would also update the server
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case "price_alert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "portfolio_change":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "dividend":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {allNotifications.filter(n => !n.read && !readState[n.id]).length} unread notifications
        </p>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      {allNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allNotifications.map((notification) => {
            const isRead = notification.read || readState[notification.id];
            
            return (
              <div
                key={notification.id}
                className={`flex items-start p-4 rounded-lg border ${
                  isRead ? "bg-background" : "bg-blue-50 dark:bg-blue-900/10"
                }`}
              >
                <div className="mr-4 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`${isRead ? "" : "font-medium"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
