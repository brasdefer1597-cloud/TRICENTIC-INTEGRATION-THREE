/*
  # SRAP Core Schema - Existential Gamification System

  ## 1. Main Tables
  
  ### `user_profiles`
  Extended user profile with gamification metrics.
  - `id` (uuid, PK, ref: auth.users)
  - `display_name` (text) - Display name
  - `total_evaluations` (int) - Completed exam counter
  - `current_level` (int) - Current user level (1-10)
  - `experience_points` (int) - Accumulated XP
  - `streak_days` (int) - Consecutive evaluation days
  - `last_evaluation_date` (date) - Last time exam was completed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `evaluations`
  Historical record of each completed SRAP exam.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK -> user_profiles)
  - `bleeding_center` (text) - head | heart | body
  - `sacrifice_center` (text) - head | heart | body
  - `oxygen_actions` (text[]) - Array of chosen actions
  - `synthesis_text` (text) - User-written synthesis
  - `ai_analysis` (text) - SRAP-AI response
  - `ai_synthesis_feedback` (text, nullable) - Synthesis analysis
  - `xp_earned` (int) - XP earned in this evaluation
  - `completed_at` (timestamptz)

  ### `achievements`
  Unlockable achievements system.
  - `id` (uuid, PK)
  - `key` (text, unique) - Achievement identifier (e.g., "first_evaluation")
  - `title` (text) - Achievement title
  - `description` (text) - Description
  - `icon` (text) - Emoji or icon
  - `xp_reward` (int) - XP granted
  - `created_at` (timestamptz)

  ### `user_achievements`
  Achievements unlocked by user.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK -> user_profiles)
  - `achievement_id` (uuid, FK -> achievements)
  - `unlocked_at` (timestamptz)

  ## 2. Security
  - RLS enabled on all tables
  - Users can only see/edit their own data
  - Achievements are public (read-only for users)

  ## 3. Indexes
  - Index on user_id for fast queries
  - Index on completed_at for temporal analysis
  - Composite index on user_achievements to prevent duplicates

  ## 4. Gamification
  - Levels from 1 to 10 (each level requires more XP)
  - Base XP per evaluation: 50
  - Streak bonus: +10 XP per day
  - Achievements grant additional XP
*/

-- Enable UUID if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT 'SRAP Warrior',
  total_evaluations int DEFAULT 0,
  current_level int DEFAULT 1,
  experience_points int DEFAULT 0,
  streak_days int DEFAULT 0,
  last_evaluation_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  bleeding_center text NOT NULL CHECK (bleeding_center IN ('head', 'heart', 'body')),
  sacrifice_center text NOT NULL CHECK (sacrifice_center IN ('head', 'heart', 'body')),
  oxygen_actions text[] DEFAULT '{}',
  synthesis_text text DEFAULT '',
  ai_analysis text DEFAULT '',
  ai_synthesis_feedback text,
  xp_earned int DEFAULT 50,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_completed_at ON evaluations(completed_at DESC);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '⚔️',
  xp_reward int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Unlocked achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Insert initial achievements
INSERT INTO achievements (key, title, description, icon, xp_reward) VALUES
  ('first_blood', 'First Blood', 'You completed your first SRAP exam. Welcome to the battlefield.', '🩸', 100),
  ('week_warrior', 'Weekly Warrior', 'Maintained a 7-day consecutive streak.', '⚔️', 200),
  ('month_survivor', 'Monthly Survivor', '30 days facing the raw reality.', '💀', 500),
  ('level_5', 'SRAP Veteran', 'Reached level 5. No turning back now.', '🎖️', 300),
  ('level_10', 'Master of Reality', 'Level 10. You have seen the abyss and the abyss has seen you.', '👁️', 1000),
  ('ten_evaluations', 'Decade of Decisions', 'Completed 10 evaluations. You know your sacrifices.', '📊', 250),
  ('honest_synthesis', 'Brutal Honesty', 'Your synthesis was validated by SRAP-AI as genuine.', '✍️', 150)
ON CONFLICT (key) DO NOTHING;

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
