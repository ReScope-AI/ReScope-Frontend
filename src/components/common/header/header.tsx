import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">
                  <img src={logo} alt="logo" className="w-full h-full rounded-sm" />
                </span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">ReScope</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <Link
                to="/retrospectives"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Retrospectives
              </Link>
              <Link
                to="/planning-poker"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Planning Poker
              </Link>
              <Link
                to="/icebreakers"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                IceBreakers
              </Link>
              <Link
                to="/pricing"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/updates"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Product Updates
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <span>🌐</span>
              <span>en</span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
              Dashboard
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/retrospectives"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Retrospectives
              </Link>
              <Link
                to="/planning-poker"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planning Poker
              </Link>
              <Link
                to="/icebreakers"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                IceBreakers
              </Link>
              <Link
                to="/pricing"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/updates"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Product Updates
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
