
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useEffect } from "react";
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

interface EditComponentDialogProps {
    component: Component;
    onUpdateComponent: (component: Component) => void;
    onClose: () => void;
}

export function EditComponentDialog({ component, onUpdateComponent, onClose }: EditComponentDialogProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: component,
  });

  useEffect(() => {
    form.reset(component);
  }, [component, form]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const updatedComponent: Component = {
        ...component,
        ...data,
        manufacturer: data.manufacturer || 'N/A',
        description: data.description || 'No description',
        unitPrice: data.unitPrice || 0,
        datasheetUrl: data.datasheetUrl || '#',
    };
    onUpdateComponent(updatedComponent);
    toast({
        title: "Item Updated",
        description: `${data.name} has been updated.`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details for {component.name}.
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
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
                    <Input {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
