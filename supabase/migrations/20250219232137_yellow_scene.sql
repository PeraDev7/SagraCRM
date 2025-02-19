/*
  # Create storage bucket for product images
  
  1. Changes
    - Create storage bucket for product images if it doesn't exist
    - Set bucket to public access
  
  Note: RLS policies are handled in a separate migration to avoid conflicts
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;