
"use client";

import { useState, useMemo } from 'react';
import InventoryView from '@/components/dashboard/inventory-view';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockComponents as initialComponents } from '@/lib/mock-data';
import type { Component, ComponentCategory } from '@/lib/types';
import { Search } from 'lucide-react';
import { AddComponentDialog } from '@/components/dashboard/add-component-dialog';
import { EditComponentDialog } from '@/components/dashboard/edit-component-dialog';
import { useToast } from '@/hooks/use-toast';

const categories: ComponentCategory[] = ['Fencing', 'Gates', 'Hardware', 'Materials', 'Tools', 'Other'];
const locations = Array.from(new Set(initialComponents.map(c => c.location)));

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const handleAddComponent = (newComponent: Omit<Component, 'id' | 'lastOutwardDate'>) => {
    const componentToAdd: Component = {
        ...newComponent,
        id: (components.length + 1).toString(),
        lastOutwardDate: new Date().toISOString(),
    };
    setComponents(prev => [componentToAdd, ...prev]);
  };

  const handleEditComponent = (updatedComponent: Component) => {
    setComponents(prev => prev.map(c => c.id === updatedComponent.id ? updatedComponent : c));
    setEditingComponent(null);
  };
  
  const handleDeleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
  };
  
  const handleUpdateQuantity = (componentId: string, newQuantity: number, reason: string, type: 'inward' | 'outward') => {
    setComponents(prev => prev.map(c => {
      if (c.id === componentId) {
        const updatedComponent = { ...c, quantity: newQuantity };
        if (type === 'outward') {
          updatedComponent.lastOutwardDate = new Date().toISOString();
        }
        return updatedComponent;
      }
      return c;
    }));
    toast({
        title: `Stock ${type === 'inward' ? 'Added' : 'Issued'}`,
        description: `Reason: ${reason}`,
    });
    // Here you would also add a new entry to your logs
  };

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchLower === '' ||
        component.name.toLowerCase().includes(searchLower) ||
        component.partNumber.toLowerCase().includes(searchLower);
      
      const matchesCategory = categoryFilter === 'all' || component.category === categoryFilter;
      const matchesLocation = locationFilter === 'all' || component.location === locationFilter;

      let matchesStock = true;
      if (stockFilter === 'in-stock') {
        matchesStock = component.quantity > component.lowStockThreshold;
      } else if (stockFilter === 'low-stock') {
        matchesStock = component.quantity > 0 && component.quantity <= component.lowStockThreshold;
      } else if (stockFilter === 'out-of-stock') {
        matchesStock = component.quantity === 0;
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesStock;
    });
  }, [components, searchTerm, categoryFilter, locationFilter, stockFilter]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <AddComponentDialog onAddComponent={handleAddComponent} />
      </header>
      <div className="p-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, part #..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <main className="flex-1 overflow-auto p-4">
        <InventoryView 
          components={filteredComponents} 
          onEdit={setEditingComponent} 
          onDelete={handleDeleteComponent}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </main>
      {editingComponent && (
        <EditComponentDialog
          component={editingComponent}
          onUpdateComponent={handleEditComponent}
          onClose={() => setEditingComponent(null)}
        />
      )}
    </div>
  );
}
