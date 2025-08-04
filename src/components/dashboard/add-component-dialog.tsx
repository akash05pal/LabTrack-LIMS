
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Component, ComponentCategory } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const categories: ComponentCategory[] = [
    'Resistors',
    'Capacitors',
    'Inductors',
    'Diodes',
    'Transistors',
    'Integrated Circuits (ICs)',
    'Connectors',
    'Sensors',
    'Microcontrollers/Dev Boards',
    'Switches/Buttons',
    'LEDs/Displays',
    'Cables/Wires'
];

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  partNumber: z.string().min(1, "Part number is required."),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  location: z.string().min(1, "Location is required."),
  category: z.enum(categories),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  datasheetUrl: z.string().url().optional().or(z.literal('')),
  lowStockThreshold: z.coerce.number().int().min(0, "Threshold cannot be negative."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddComponentDialogProps {
    onAddComponent: (component: Omit<Component, 'id' | 'lastOutwardDate'>) => void;
}

export function AddComponentDialog({ onAddComponent }: AddComponentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      partNumber: "",
      quantity: 0,
      location: "",
      category: "Resistors",
      manufacturer: "",
      description: "",
      unitPrice: 0,
      datasheetUrl: "",
      lowStockThreshold: 10,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newComponent: Omit<Component, 'id' | 'lastOutwardDate'> = {
        ...data,
        manufacturer: data.manufacturer || 'N/A',
        description: data.description || 'No description',
        unitPrice: data.unitPrice || 0,
        datasheetUrl: data.datasheetUrl || '#',
    };
    onAddComponent(newComponent);
    toast({
        title: "Component Added",
        description: `${data.name} has been added to the inventory.`,
    });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Resistor (100 Ohm, 1/4W)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part #</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., R100_1/4W" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock At</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., R-Shelf-A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="!justify-between mt-6">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
