'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import RadarChartComponent from './radar-chart';

interface RadarChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RadarChartDialog({
  open,
  onOpenChange
}: RadarChartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Team Performance Overview
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <RadarChartComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
