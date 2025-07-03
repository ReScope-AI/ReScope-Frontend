import React, { type ReactNode } from 'react';
import i18n from '@/utils/config/i18n';
import { I18nextProvider } from 'react-i18next';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default AppProvider;
