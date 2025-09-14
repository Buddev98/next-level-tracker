import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationList } from "@/components/notification-list";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user's notifications
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id as string,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Stay updated on important changes to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationList notifications={notifications} />
        </CardContent>
      </Card>
    </div>
  );
}
