import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Laptop, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/utils/hooks/useTheme';
import './index.css';

const AppLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Toggle between languages
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              {t('app.title')}
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/sprints"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.includes('/sprints') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Sprints
              </Link>
              <Link
                to="/board"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.includes('/board') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Board
              </Link>
              <Link
                to="/questions"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.includes('/questions')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                Questions
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
              }}
            >
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Laptop className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sprint Retrospective. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
