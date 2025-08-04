import { cn } from '@/lib/utils';
import { CircuitBoard } from 'lucide-react';
import * as React from 'react';

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <CircuitBoard className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold text-primary">LabTrack</span>
    </div>
  );
}
