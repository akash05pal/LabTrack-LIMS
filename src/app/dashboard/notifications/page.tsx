import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Zap } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Configure Alerts
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Notifications</CardTitle>
            <CardDescription>Recent alerts and updates will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center p-12">
            <Bell className="w-16 h-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No New Notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">You're all caught up!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import { Button } from "@/components/ui/button";
