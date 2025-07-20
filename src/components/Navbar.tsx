import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Home, Upload, Info, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-green-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AgroGuardian</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link
              to="/upload"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/upload') 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{t('nav.upload')}</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{t('nav.about')}</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin') 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('nav.admin')}</span>
            </Link>
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-green-700 border-t border-green-500">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-green-800 text-white' 
                : 'text-green-100 hover:bg-green-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('nav.home')}</span>
          </Link>
          <Link
            to="/upload"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
              isActive('/upload') 
                ? 'bg-green-800 text-white' 
                : 'text-green-100 hover:bg-green-600'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>{t('nav.upload')}</span>
          </Link>
          <Link
            to="/about"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
              isActive('/about') 
                ? 'bg-green-800 text-white' 
                : 'text-green-100 hover:bg-green-600'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>{t('nav.about')}</span>
          </Link>
          <Link
            to="/admin"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
              isActive('/admin') 
                ? 'bg-green-800 text-white' 
                : 'text-green-100 hover:bg-green-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>{t('nav.admin')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;