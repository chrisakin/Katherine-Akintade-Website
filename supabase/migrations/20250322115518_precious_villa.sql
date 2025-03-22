/*
  # Create podcasts table

  1. New Tables
    - `podcasts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `guest` (text)
      - `type` (text, either 'audio' or 'video')
      - `media_url` (text, required)
      - `thumbnail_url` (text)
      - `duration` (text)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage podcasts
    - Allow public read access to active podcasts
*/

-- Create podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  guest text,
  type text NOT NULL CHECK (type IN ('audio', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  duration text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to active podcasts"
  ON podcasts
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Allow authenticated users to manage podcasts"
  ON podcasts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();