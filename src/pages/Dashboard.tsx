import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Navigation } from '../components/Navigation';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benvenuto nel tuo Pannello di Amministrazione</h2>
            <p className="text-gray-600 mb-8">
              Inizia gestendo i tuoi prodotti o creandone uno nuovo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/products"
                className="block p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestisci Prodotti</h3>
                <p className="text-gray-600">Visualizza, modifica ed elimina i tuoi prodotti esistenti.</p>
              </Link>

              <Link
                to="/products/new"
                className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuovo Prodotto</h3>
                <p className="text-gray-600">Aggiungi un nuovo prodotto al tuo catalogo.</p>
              </Link>

              <Link
                to="/categories"
                className="block p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestisci Categorie</h3>
                <p className="text-gray-600">Organizza i tuoi prodotti in categorie e sottocategorie.</p>
              </Link>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                to="/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Prodotto
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}