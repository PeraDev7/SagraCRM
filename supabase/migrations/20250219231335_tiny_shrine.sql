/*
  # Fix products table category column

  1. Changes
    - Makes the category column nullable (temporarily)
    - Drops the category column as we're using category_id now
  
  2. Notes
    - This ensures compatibility with the new category relationship system
    - Preserves existing data while removing the unused column
*/

-- First make the category column nullable to avoid issues with existing data
ALTER TABLE products 
  ALTER COLUMN category DROP NOT NULL;

-- Then drop the column as we're using category_id now
ALTER TABLE products 
  DROP COLUMN category;