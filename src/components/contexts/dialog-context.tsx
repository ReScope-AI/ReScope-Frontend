'use client';

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from 'react';

import { CustomDialog } from '@/components/ui/custom-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export interface DialogProps {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  slotProps?: {
    dialog?: React.ComponentProps<typeof Dialog>;
    dialogContent?: React.ComponentProps<typeof DialogContent>;
    dialogHeader?: React.ComponentProps<typeof DialogHeader>;
    dialogTitle?: React.ComponentProps<typeof DialogTitle>;
    dialogDescription?: React.ComponentProps<typeof DialogDescription>;
    dialogFooter?: React.ComponentProps<typeof DialogFooter>;
  };
}

export type DialogShowFuncProps = Omit<DialogProps, 'open'>;

export interface DialogContextType {
  showDialog: (config: DialogShowFuncProps) => void;
  closeDialog: () => void;
  props: DialogProps;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined
);

const DialogProviderWithoutComponent: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [dialogProps, setDialogProps] = useState<DialogProps>({
    open: false
  });

  const closeDialog = useCallback(() => {
    setDialogProps((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    if (!dialogProps.open && dialogProps.onClose) {
      const onCloseCallback = dialogProps.onClose;
      onCloseCallback();
      setDialogProps((prev) => ({ ...prev, onClose: undefined }));
    }
  }, [dialogProps.open, dialogProps.onClose]);

  const showDialog = useCallback((config: DialogShowFuncProps) => {
    setDialogProps({ ...config, open: true });
  }, []);

  return (
    <DialogContext.Provider
      value={{ showDialog, closeDialog, props: dialogProps }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const DialogProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <DialogProviderWithoutComponent>
      {children}
      <CustomDialog />
    </DialogProviderWithoutComponent>
  );
};

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
