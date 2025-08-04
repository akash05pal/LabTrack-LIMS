
import { MoreHorizontal, FileText, ExternalLink, ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Component } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InwardOutwardDialog } from './inward-outward-dialog';
import { useState } from 'react';

interface ComponentTableProps {
  components: Component[];
  onEdit: (component: Component) => void;
  onDelete: (componentId: string) => void;
  onUpdateQuantity: (componentId: string, newQuantity: number, reason: string, type: 'inward' | 'outward') => void;
}

function StockStatus({ quantity, lowStockThreshold }: { quantity: number; lowStockThreshold: number }) {
  if (quantity === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (quantity < lowStockThreshold) {
    return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Low Stock</Badge>;
  }
  return <Badge variant="default" className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
}

export default function ComponentTable({ components, onEdit, onDelete, onUpdateQuantity }: ComponentTableProps) {
    const [dialogState, setDialogState] = useState<{ open: boolean; type: 'inward' | 'outward'; component: Component | null }>({ open: false, type: 'inward', component: null });

    const handleOpenDialog = (type: 'inward' | 'outward', component: Component) => {
        setDialogState({ open: true, type, component });
    }

    const handleCloseDialog = () => {
        setDialogState({ open: false, type: 'inward', component: null });
    }
    
    const handleSubmit = (quantity: number, reason: string) => {
        if (dialogState.component) {
            const newQuantity = dialogState.type === 'inward' 
                ? dialogState.component.quantity + quantity
                : dialogState.component.quantity - quantity;
            onUpdateQuantity(dialogState.component.id, newQuantity, reason, dialogState.type);
        }
    }


  return (
    <>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Outward</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell className="font-medium">{component.name}</TableCell>
                <TableCell className="text-muted-foreground">{component.partNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline">{component.category}</Badge>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-semibold",
                  component.quantity === 0 && "text-destructive",
                  component.quantity > 0 && component.quantity < component.lowStockThreshold && "text-amber-600"
                )}>
                  {component.quantity}
                </TableCell>
                <TableCell className="text-muted-foreground">{component.location}</TableCell>
                <TableCell>
                  <StockStatus quantity={component.quantity} lowStockThreshold={component.lowStockThreshold} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(component.lastOutwardDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('outward', component)}>
                        <ArrowDown className="h-3 w-3 mr-1" /> Issue
                    </Button>
                     <Button variant="outline" size="sm" onClick={() => handleOpenDialog('inward', component)}>
                        <ArrowUp className="h-3 w-3 mr-1" /> Add
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => onEdit(component)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Logs</DropdownMenuItem>
                        <a href={component.datasheetUrl} target="_blank" rel="noopener noreferrer">
                            <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Datasheet
                            <ExternalLink className="ml-auto h-3 w-3" />
                            </DropdownMenuItem>
                        </a>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onSelect={() => onDelete(component.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {dialogState.open && dialogState.component && (
        <InwardOutwardDialog
            type={dialogState.type}
            component={dialogState.component}
            onClose={handleCloseDialog}
            onSubmit={handleSubmit}
        />
    )}
    </>
  );
}
