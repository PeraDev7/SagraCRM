/*
  # Create API keys table
  
  1. New Tables
    - `api_keys`
      - `user_id` (uuid, primary key, references auth.users)
      - `key` (text, not null)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS
    - Add policies for users to manage their own API keys
*/

CREATE TABLE IF NOT EXISTS api_keys (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);