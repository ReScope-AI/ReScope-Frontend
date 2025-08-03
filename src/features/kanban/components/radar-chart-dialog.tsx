'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <Card className='border-border mx-auto w-full max-w-xl border shadow-md'>
            <CardHeader>
              <CardTitle className='text-center text-lg font-semibold'>
                Performance Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className='h-[400px] p-4'>
              <RadarChartComponent />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
