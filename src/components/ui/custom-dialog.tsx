'use client';

import React from 'react';

import { useDialog } from '@/components/contexts/dialog-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export const CustomDialog: React.FC = () => {
  const { props, closeDialog } = useDialog();

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={onChange}
      {...props.slotProps?.dialog}
    >
      <DialogContent {...props.slotProps?.dialogContent}>
        <DialogHeader {...props.slotProps?.dialogHeader}>
          {props.title && (
            <DialogTitle {...props.slotProps?.dialogTitle}>
              {props.title}
            </DialogTitle>
          )}
          {props.slotProps?.dialogDescription && (
            <DialogDescription {...props.slotProps.dialogDescription} />
          )}
        </DialogHeader>

        <div className='bg-amber-800 py-4'>12{props.content}</div>

        {props.slotProps?.dialogFooter && (
          <DialogFooter {...props.slotProps.dialogFooter} />
        )}
      </DialogContent>
    </Dialog>
  );
};
