/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import AppProvider from './components/layouts/app-layout/app-provider';
import { AppRoutes } from './router';

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
