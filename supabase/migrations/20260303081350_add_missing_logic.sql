-- Add increment_xp function
CREATE OR REPLACE FUNCTION increment_xp(u_id uuid, amount int)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET experience_points = experience_points + amount,
      updated_at = now()
  WHERE id = u_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add Tricentric Earthquake achievement
INSERT INTO achievements (key, title, description, icon, xp_reward) VALUES
  ('tricentric_earthquake', 'Tricentric Earthquake', 'Deep integration of the three centers achieved.', '🌋', 150)
ON CONFLICT (key) DO NOTHING;

-- Create tricentric_earthquake RPC function to unlock the achievement
CREATE OR REPLACE FUNCTION tricentric_earthquake(u_id uuid)
RETURNS void AS $$
DECLARE
  v_achievement_id uuid;
BEGIN
  -- Get the achievement ID
  SELECT id INTO v_achievement_id FROM achievements WHERE key = 'tricentric_earthquake';
  
  -- Insert user achievement if not already unlocked
  INSERT INTO user_achievements (user_id, achievement_id)
  VALUES (u_id, v_achievement_id)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;
  
  -- Award XP for the achievement
  UPDATE user_profiles
  SET experience_points = experience_points + 150,
      updated_at = now()
  WHERE id = u_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
