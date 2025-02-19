/*
  # Storage bucket and policies setup

  1. Changes
    - Creates products storage bucket if it doesn't exist
    - Creates storage policies if they don't exist
  
  2. Notes
    - Uses DO blocks to check for existing policies
    - Prevents duplicate policy creation
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'products');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated users can upload images'
    ) THEN
        CREATE POLICY "Authenticated users can upload images"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'products'
            AND auth.role() = 'authenticated'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated users can delete images'
    ) THEN
        CREATE POLICY "Authenticated users can delete images"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
            bucket_id = 'products'
            AND auth.role() = 'authenticated'
        );
    END IF;
END $$;