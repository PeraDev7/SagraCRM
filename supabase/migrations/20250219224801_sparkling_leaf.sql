/*
  # Create products table and security policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `inventory` (integer)
      - `category` (text)
      - `status` (text)
      - `images` (text array)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to:
      - Read all products
      - Create products
      - Update their own products
      - Delete their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  inventory integer NOT NULL DEFAULT 0 CHECK (inventory >= 0),
  category text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'active')),
  images text[] DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read all products
CREATE POLICY "Users can read all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to insert their own products
CREATE POLICY "Users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own products
CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own products
CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);