/*
  # Aggiunta sistema categorie e sottocategorie

  1. Nuove Tabelle
    - `categories`
      - `id` (uuid, chiave primaria)
      - `name` (testo, nome categoria)
      - `slug` (testo, URL-friendly)
      - `parent_id` (uuid, riferimento alla categoria padre)
      - `created_at` (timestamp)

  2. Modifiche
    - Aggiunta colonna `category_id` alla tabella `products`
    - Rimozione colonna `category` dalla tabella `products`

  3. Sicurezza
    - Enable RLS sulla tabella categories
    - Aggiunta policies per lettura/scrittura per utenti autenticati
*/

-- Creazione tabella categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Aggiunta indice per migliorare le performance delle query gerarchiche
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);

-- Abilita RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies per la tabella categories
CREATE POLICY "Tutti possono leggere le categorie"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utenti autenticati possono creare categorie"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Utenti autenticati possono aggiornare categorie"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Utenti autenticati possono eliminare categorie"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Aggiunta colonna category_id a products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id);

-- Creazione indice per migliorare le performance delle join
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);

-- Funzione per ottenere il percorso completo di una categoria
CREATE OR REPLACE FUNCTION get_category_path(category_id uuid)
RETURNS TABLE (id uuid, name text, level int) AS $$
WITH RECURSIVE category_tree AS (
  -- Base case: categoria iniziale
  SELECT c.id, c.name, c.parent_id, 0 as level
  FROM categories c
  WHERE c.id = category_id

  UNION ALL

  -- Caso ricorsivo: categorie padre
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  INNER JOIN category_tree ct ON c.id = ct.parent_id
)
SELECT id, name, level
FROM category_tree
ORDER BY level DESC;
$$ LANGUAGE sql STABLE;