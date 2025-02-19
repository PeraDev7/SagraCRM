import React, { useEffect, useState } from 'react';
import { Key, Copy, Check } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  async function loadApiKey() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setApiKey(data?.key || '');
    } catch (error) {
      console.error('Error loading API key:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateApiKey() {
    const newKey = 'pk_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert({ 
          user_id: user?.id, 
          key: newKey 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;

      setApiKey(newKey);
      toast.success('Nuova API key generata con successo');
    } catch (error) {
      toast.error('Errore nella generazione dell\'API key');
      console.error('Error:', error);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('API key copiata negli appunti');
    } catch (error) {
      toast.error('Errore nella copia dell\'API key');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-gray-500">Caricamento impostazioni...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Impostazioni</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">API Key</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      {apiKey ? (
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {apiKey}
                        </code>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Nessuna API key generata
                        </span>
                      )}
                    </div>
                    {apiKey && (
                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Copia API key"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={generateApiKey}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                  >
                    {apiKey ? 'Rigenera API Key' : 'Genera API Key'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Usa questa API key per autenticare le tue richieste API. 
                  Mantieni questa chiave segreta e non condividerla con nessuno.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sicurezza API</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>Non condividere mai la tua API key</li>
                      <li>Rigenera la key se sospetti che sia stata compromessa</li>
                      <li>Usa HTTPS per tutte le richieste API</li>
                      <li>Implementa rate limiting nelle tue applicazioni</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}