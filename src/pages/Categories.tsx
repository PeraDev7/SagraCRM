import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/Navigation';
import toast from 'react-hot-toast';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: '',
    parent_id: null as string | null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error('Errore nel caricamento delle categorie');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const slug = newCategory.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const { error } = await supabase.from('categories').insert([
        {
          name: newCategory.name,
          slug,
          parent_id: newCategory.parent_id
        }
      ]);

      if (error) throw error;

      toast.success('Categoria creata con successo');
      setNewCategory({ name: '', parent_id: null });
      loadCategories();
    } catch (error) {
      toast.error('Errore nella creazione della categoria');
      console.error('Error:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Sei sicuro di voler eliminare questa categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Categoria eliminata con successo');
      loadCategories();
    } catch (error) {
      toast.error('Errore durante l\'eliminazione della categoria');
      console.error('Error:', error);
    }
  }

  function buildCategoryTree(categories: Category[], parentId: string | null = null): Category[] {
    return categories
      .filter(category => category.parent_id === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  }

  function renderCategory(category: Category & { children?: Category[] }, level = 0) {
    return (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50 transition-colors duration-150">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center">
                {level > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />}
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {category.slug}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
        {category.children?.map(child => renderCategory(child, level + 1))}
      </React.Fragment>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-gray-500">Caricamento categorie...</div>
        </div>
      </div>
    );
  }

  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categorie</h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Nuova Categoria</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200"
                    placeholder="Nome categoria"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria Padre (opzionale)
                  </label>
                  <select
                    value={newCategory.parent_id || ''}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, parent_id: e.target.value || null }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200"
                  >
                    <option value="">Nessuna (categoria principale)</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                >
                  Aggiungi Categoria
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryTree.map(category => renderCategory(category))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}