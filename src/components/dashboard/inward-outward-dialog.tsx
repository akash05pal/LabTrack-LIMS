
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
import type { Component } from "@/lib/types";

interface InwardOutwardDialogProps {
    type: 'inward' | 'outward';
    component: Component;
    onClose: () => void;
    onSubmit: (quantity: number, reason: string) => void;
}

export function InwardOutwardDialog({ type, component, onClose, onSubmit }: InwardOutwardDialogProps) {

  const formSchema = z.object({
    quantity: z.coerce.number().int().positive("Quantity must be positive.").max(
        type === 'outward' ? component.quantity : Infinity,
        `Cannot issue more than available stock (${component.quantity})`
    ),
    reason: z.string().min(3, "A reason or project name is required (min 3 chars)."),
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      reason: "",
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data.quantity, data.reason);
    onClose();
  };
  
  const title = type === 'inward' ? "Add Stock (Inward)" : "Issue Stock (Outward)";
  const description = `Update stock for ${component.name}. Current quantity: ${component.quantity}.`;
  const buttonText = type === 'inward' ? "Add to Stock" : "Issue from Stock";


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason / Project</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Project Phoenix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="!justify-between mt-6">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
