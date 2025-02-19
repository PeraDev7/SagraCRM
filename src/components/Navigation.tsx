import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "border-indigo-500 text-gray-900"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Pannello Admin</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${isActive('/')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/products"
                className={`${isActive('/products')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Prodotti
              </Link>
              <Link
                to="/categories"
                className={`${isActive('/categories')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Categorie
              </Link>
              <Link
                to="/api"
                className={`${isActive('/api')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                API
              </Link>
              <Link
                to="/settings"
                className={`${isActive('/settings')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Impostazioni
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/settings"
              className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}