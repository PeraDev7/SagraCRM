/*
  # Create storage bucket for product images

  1. Storage Bucket
    - Creates a new public bucket named 'products' for storing product images
  
  2. Security
    - Enables public access for viewing images
    - Restricts upload/delete operations to authenticated users only
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for storage.objects
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);