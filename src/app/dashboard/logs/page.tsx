import { mockLogs } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Edit, Plus } from 'lucide-react';

function getActionIcon(action: string) {
    switch (action) {
        case 'Added':
            return <Plus className="h-4 w-4 text-green-500" />;
        case 'Removed':
            return <ArrowDown className="h-4 w-4 text-red-500" />;
        case 'Updated':
            return <Edit className="h-4 w-4 text-blue-500" />;
        default:
            return <ArrowUp className="h-4 w-4 text-yellow-500" />;
    }
}

export default function LogsPage() {
  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of all recent component stock changes and activities.</CardDescription>
            </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.user.avatar} alt={log.user.name} data-ai-hint="profile picture" />
                          <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <Badge
                                variant="outline"
                                className={cn(
                                log.action === 'Added' && 'border-green-500 text-green-500',
                                log.action === 'Removed' && 'border-red-500 text-red-500',
                                log.action === 'Updated' && 'border-blue-500 text-blue-500',
                                log.action === 'Issued' && 'border-yellow-500 text-yellow-500'
                                )}
                            >
                                {log.action}
                            </Badge>
                       </div>
                    </TableCell>
                    <TableCell>{log.componentName}</TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                        <div className="flex flex-col items-end">
                            <span title={format(new Date(log.timestamp), 'PPpp')}>
                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </span>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
