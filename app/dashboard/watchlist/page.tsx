import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { WatchlistDetail } from "@/components/watchlist-detail";

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user's watchlists
  const watchlists = await prisma.watchlist.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      items: true,
    },
  });

  // Create a default watchlist if none exists
  if (watchlists.length === 0) {
    const defaultWatchlist = await prisma.watchlist.create({
      data: {
        name: "My Watchlist",
        userId: session.user.id as string,
      },
    });
    
    watchlists.push({
      ...defaultWatchlist,
      items: [],
    });
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Watchlists</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/watchlist/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Watchlist
            </Button>
          </Link>
          <Link href="/dashboard/watchlist/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Security
            </Button>
          </Link>
        </div>
      </div>

      {watchlists.length === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>{watchlists[0].name}</CardTitle>
            <CardDescription>
              Securities you're monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WatchlistDetail watchlist={watchlists[0]} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={watchlists[0]?.id} className="space-y-6">
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
          
          {watchlists.map((watchlist) => (
            <TabsContent key={watchlist.id} value={watchlist.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{watchlist.name}</CardTitle>
                      <CardDescription>
                        Securities you're monitoring
                      </CardDescription>
                    </div>
                    <Link href={`/dashboard/watchlist/${watchlist.id}/edit`}>
                      <Button variant="outline" size="sm">Edit Watchlist</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <WatchlistDetail watchlist={watchlist} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
