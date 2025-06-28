
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Cloud, Map, MapPin, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import PWAInstallButton from './PWAInstallButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/', icon: Activity },
    { name: 'Cuaca', href: '/weather', icon: Cloud },
    { name: 'Peta', href: '/map', icon: Map },
    { name: 'Lokasi', href: '/location', icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-b border-blue-100 dark:border-slate-700 sticky top-0 z-50 shadow-sm dark:shadow-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                  InfoGempa
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">BMKG Indonesia</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle and Mobile menu button */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-blue-100 dark:border-slate-700">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-semibold text-lg">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* PWA Install Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <PWAInstallButton />
      </div>

      {/* Compact Footer */}
      <footer className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-blue-100 dark:border-slate-700 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">InfoGempa</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Data BMKG Indonesia</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mendukung mode offline & PWA
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                © 2025 InfoGempa
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
