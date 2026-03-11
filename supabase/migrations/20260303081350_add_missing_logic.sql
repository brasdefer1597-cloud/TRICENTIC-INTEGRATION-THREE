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
