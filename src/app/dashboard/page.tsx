
import { mockComponents, mockLogs } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, PackageX, History, AlertCircle, HardDrive, Clock } from 'lucide-react';
import { InwardOutwardChart } from '@/components/dashboard/inward-outward-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { isBefore, subMonths } from 'date-fns';

export default function DashboardPage() {
  const totalComponents = mockComponents.length;
  const inStock = mockComponents.filter(c => c.quantity > 0).length;
  const outOfStock = mockComponents.filter(c => c.quantity === 0).length;
  const lowStock = mockComponents.filter(c => c.quantity > 0 && c.quantity <= c.lowStockThreshold).length;
  const totalValue = mockComponents.reduce((acc, c) => acc + (c.quantity * c.unitPrice), 0);

  const lowStockItems = mockComponents.filter(c => c.quantity > 0 && c.quantity <= c.lowStockThreshold);
  
  const threeMonthsAgo = subMonths(new Date(), 3);
  const oldStockItems = mockComponents.filter(c => 
    isBefore(new Date(c.lastOutwardDate), threeMonthsAgo)
  );

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item Types</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComponents}</div>
            <p className="text-xs text-muted-foreground">{inStock} types in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStock}</div>
            <p className="text-xs text-muted-foreground">Items needing attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <PackageX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">Items to reorder immediately</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Movement</CardTitle>
            <CardDescription>Inward and Outward item quantities over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <InwardOutwardChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Critically Low Stock</CardTitle>
            <CardDescription>These items have fallen below their defined threshold.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lowStockItems.length > 0 ? lowStockItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.partNumber}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="secondary" className="bg-amber-500 text-white">{item.quantity}</Badge>
                            </TableCell>
                        </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No items with low stock.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Old Stock Alert</CardTitle>
            <CardDescription>Items with no outward movement in over 3 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Last Outward</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {oldStockItems.length > 0 ? oldStockItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.partNumber}</div>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {new Date(item.lastOutwardDate).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No old stock items.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
