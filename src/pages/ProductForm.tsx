import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import { ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInput = Omit<Product, 'id' | 'created_at' | 'user_id'>;
type Category = Database['public']['Tables']['categories']['Row'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductInput>({
    title: '',
    description: '',
    price: 0,
    inventory: 0,
    category_id: '',
    status: 'draft',
    images: []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct(id);
    }
  }, [id]);

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
    }
  }

  async function loadProduct(productId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      if (data) {
        const { id, created_at, user_id, ...productData } = data;
        setProduct(productData);
      }
    } catch (error) {
      toast.error('Errore nel caricamento del prodotto');
      console.error('Error:', error);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Per favore seleziona un\'immagine valida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine deve essere inferiore a 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setProduct(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }));

      toast.success('Immagine caricata con successo');
    } catch (error) {
      toast.error('Errore nel caricamento dell\'immagine');
      console.error('Error:', error);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleRemoveImage(imageUrl: string) {
    try {
      const filePath = imageUrl.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

      if (error) throw error;

      setProduct(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageUrl)
      }));

      toast.success('Immagine rimossa con successo');
    } catch (error) {
      toast.error('Errore nella rimozione dell\'immagine');
      console.error('Error:', error);
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!product.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }

    if (!product.category_id) {
      newErrors.category_id = 'La categoria è obbligatoria';
    }

    if (product.price < 0) {
      newErrors.price = 'Il prezzo non può essere negativo';
    }

    if (product.inventory < 0) {
      newErrors.inventory = 'L\'inventario non può essere negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast.error('Per favore correggi gli errori nel form');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        const { error } = await supabase
          .from('products')
          .update(product)
          .eq('id', id);

        if (error) throw error;
        toast.success('Prodotto aggiornato con successo');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...product, user_id: user.id }]);

        if (error) throw error;
        toast.success('Prodotto creato con successo');
      }

      navigate('/products');
    } catch (error) {
      toast.error('Errore nel salvataggio del prodotto');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inventory' ? parseFloat(value) || 0 : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {id ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Immagini del Prodotto
                </label>
                <div className="mt-1 flex flex-wrap gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="text-gray-400">Caricamento...</div>
                    ) : (
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titolo
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={product.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome del prodotto"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={product.description || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200"
                  placeholder="Descrizione dettagliata del prodotto"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prezzo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">€</span>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inventario
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    required
                    min="0"
                    value={product.inventory}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200 ${
                      errors.inventory ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.inventory && (
                    <p className="mt-1 text-sm text-red-600">{errors.inventory}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200 ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Seleziona una categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stato
                </label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200"
                >
                  <option value="draft">Bozza</option>
                  <option value="active">Attivo</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Salvataggio...' : 'Salva Prodotto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}