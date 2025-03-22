/*
  # Create analytics tables

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration` (interval)
      - `page` (text)
      
    - `sales_tracking`
      - `id` (uuid, primary key)
      - `order_id` (text)
      - `amount` (integer)
      - `created_at` (timestamp)
      
    - `activity_logs`
      - `id` (uuid, primary key)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to read analytics
    - Allow insertion of analytics data
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration interval,
  page text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sales_tracking table
CREATE TABLE IF NOT EXISTS sales_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL,
  amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read user_sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insertion of user_sessions"
  ON user_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read sales_tracking"
  ON sales_tracking
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insertion of sales_tracking"
  ON sales_tracking
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read activity_logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insertion of activity_logs"
  ON activity_logs
  FOR INSERT
  TO public
  WITH CHECK (true);