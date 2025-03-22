/*
  # Create images tables

  1. New Tables
    - `hero_images`
      - `id` (uuid, primary key)
      - `url` (text, required)
      - `active` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `gallery_images`
      - `id` (uuid, primary key)
      - `url` (text, required)
      - `description` (text)
      - `category` (text)
      - `photographer` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage images
*/

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  description text,
  category text NOT NULL,
  photographer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_images
CREATE POLICY "Allow public read access to hero_images"
  ON hero_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage hero_images"
  ON hero_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for gallery_images
CREATE POLICY "Allow public read access to gallery_images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage gallery_images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();