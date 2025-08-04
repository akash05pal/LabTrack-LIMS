
"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import type { Component } from '@/lib/types';
import ComponentTable from './component-table';
import ComponentCards from './component-cards';

interface InventoryViewProps {
  components: Component[];
  onEdit: (component: Component) => void;
  onDelete: (componentId: string) => void;
  onUpdateQuantity: (componentId: string, newQuantity: number, reason: string, type: 'inward' | 'outward') => void;
}

export default function InventoryView({ components, onEdit, onDelete, onUpdateQuantity }: InventoryViewProps) {
  const isMobile = useIsMobile();
  
  if (isMobile === undefined) {
    // Skeleton loader while determining screen size
    return (
      <div className="space-y-4">
        <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return isMobile ? (
    <ComponentCards components={components} onEdit={onEdit} onDelete={onDelete} onUpdateQuantity={onUpdateQuantity} />
  ) : (
    <ComponentTable components={components} onEdit={onEdit} onDelete={onDelete} onUpdateQuantity={onUpdateQuantity} />
  );
}
