-- Seed Data for Launch
-- This creates sample badges, events, and initial data

-- Sample Badges
-- Valid categories: 'skill', 'achievement', 'certification', 'course', 'event'
INSERT INTO badges (name, description, image_url, category, issuer_id, is_active)
VALUES
  ('React Master', 'Completed advanced React development course', 'https://via.placeholder.com/200', 'certification', NULL, true),
  ('Blockchain Expert', 'Expert in blockchain and Web3 technologies', 'https://via.placeholder.com/200', 'skill', NULL, true),
  ('Event Organizer', 'Successfully organized 5+ events', 'https://via.placeholder.com/200', 'achievement', NULL, true),
  ('Community Builder', 'Built and grew a community of 100+ members', 'https://via.placeholder.com/200', 'achievement', NULL, true),
  ('Open Source Contributor', 'Contributed to 10+ open source projects', 'https://via.placeholder.com/200', 'achievement', NULL, true),
  ('Public Speaker', 'Spoke at 3+ conferences or events', 'https://via.placeholder.com/200', 'achievement', NULL, true),
  ('Mentor', 'Mentored 5+ developers or students', 'https://via.placeholder.com/200', 'achievement', NULL, true),
  ('Startup Founder', 'Founded and launched a startup', 'https://via.placeholder.com/200', 'achievement', NULL, true)
ON CONFLICT DO NOTHING;

-- Note: Events and achievements will be created by users
-- This seed data provides the foundation for the platform
-- Note: The 'interests' table doesn't exist in the current schema, so it's been removed from seed data

