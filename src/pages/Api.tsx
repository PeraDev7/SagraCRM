import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Api() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = React.useState<string>('');

  React.useEffect(() => {
    loadApiKey();
  }, []);

  async function loadApiKey() {
    try {
      const { data } = await supabase
        .from('api_keys')
        .select('key')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setApiKey(data.key);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Documentazione API</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Autenticazione</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Tutte le richieste API devono includere la tua API key nell'header:
                  </p>
                  <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
                    Authorization: Bearer {apiKey || '<la-tua-api-key>'}
                  </pre>
                  {!apiKey && (
                    <p className="mt-2 text-sm text-yellow-600">
                      Vai nelle <Link to="/settings" className="text-indigo-600 hover:text-indigo-800">Impostazioni</Link> per generare la tua API key
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Endpoint Prodotti</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/products</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Recupera lista prodotti</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Parametri Query:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      <li>page: numero pagina (default: 1)</li>
                      <li>limit: elementi per pagina (default: 10)</li>
                      <li>category_id: filtra per categoria</li>
                      <li>status: filtra per stato (active/draft)</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/products/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Recupera dettagli singolo prodotto</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">POST</span>
                      <code className="ml-2 text-sm">/api/products</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Crea nuovo prodotto</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Body (JSON):</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "title": "string",
  "description": "string",
  "price": number,
  "inventory": number,
  "category_id": "uuid",
  "status": "draft" | "active",
  "images": string[]
}`}
                    </pre>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded">PUT</span>
                      <code className="ml-2 text-sm">/api/products/:id</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Aggiorna prodotto esistente</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Body (JSON):</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "title": "string",
  "description": "string",
  "price": number,
  "inventory": number,
  "category_id": "uuid",
  "status": "draft" | "active",
  "images": string[]
}`}
                    </pre>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded">DELETE</span>
                      <code className="ml-2 text-sm">/api/products/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Elimina prodotto</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Endpoint Categorie</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/categories</code>
                    </div>
                    <p className="text-sm text-gray-600">Recupera lista categorie</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/categories/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Recupera dettagli singola categoria</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">POST</span>
                      <code className="ml-2 text-sm">/api/categories</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Crea nuova categoria</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Body (JSON):</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "name": "string",
  "parent_id": "uuid" | null
}`}
                    </pre>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded">PUT</span>
                      <code className="ml-2 text-sm">/api/categories/:id</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Aggiorna categoria esistente</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Body (JSON):</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "name": "string",
  "parent_id": "uuid" | null
}`}
                    </pre>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded">DELETE</span>
                      <code className="ml-2 text-sm">/api/categories/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Elimina categoria</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Endpoint Ordini</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">POST</span>
                      <code className="ml-2 text-sm">/api/orders</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Crea un nuovo ordine</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Body (JSON):</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "items": [
    {
      "product_id": "uuid",
      "quantity": number,
      "price": number
    }
  ]
}`}
                    </pre>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Risposta:</h3>
                    <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
{`{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "total": number,
  "status": "pending",
  "created_at": "timestamp",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": number,
      "price": number
    }
  ]
}`}
                    </pre>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/orders/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Recupera dettagli di un ordine</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">GET</span>
                      <code className="ml-2 text-sm">/api/orders</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Recupera lista ordini</p>
                    <h3 className="text-sm font-medium text-gray-700 mt-3">Parametri Query:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      <li>page: numero pagina (default: 1)</li>
                      <li>limit: elementi per pagina (default: 10)</li>
                      <li>status: filtra per stato (pending/completed/cancelled)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Codici di Risposta</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><span className="font-medium">200</span> - Richiesta completata con successo</li>
                  <li><span className="font-medium">201</span> - Risorsa creata con successo</li>
                  <li><span className="font-medium">400</span> - Richiesta non valida</li>
                  <li><span className="font-medium">401</span> - Non autorizzato</li>
                  <li><span className="font-medium">403</span> - Accesso negato</li>
                  <li><span className="font-medium">404</span> - Risorsa non trovata</li>
                  <li><span className="font-medium">500</span> - Errore interno del server</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}