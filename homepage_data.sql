-- Insert sample homepage content
INSERT INTO homepage_content (
  profile_image_url,
  tagline, 
  biography, 
  hero_title, 
  hero_subtitle, 
  what_i_do_title, 
  what_i_do_description
) VALUES (
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  'Transforming Leadership Through Strategic Vision and Authentic Communication',
  'Dr. Sarah Johnson is a renowned leadership expert, keynote speaker, and bestselling author with over 20 years of experience helping organizations and individuals reach their full potential. She has spoken at Fortune 500 companies worldwide and authored multiple award-winning books on leadership, strategy, and personal development. Her unique approach combines academic rigor with practical application, making complex leadership concepts accessible and actionable for leaders at all levels.',
  'Empowering Leaders to Create Lasting Impact',
  'Through books, speaking, and consulting, I help leaders and organizations unlock their potential and achieve extraordinary results.',
  'What I Do',
  'I specialize in leadership development, strategic communication, and organizational transformation. My work focuses on helping leaders build high-performance teams, navigate complex challenges, and create cultures of innovation and excellence.'
) ON CONFLICT (id) DO UPDATE SET
  profile_image_url = EXCLUDED.profile_image_url,
  tagline = EXCLUDED.tagline,
  biography = EXCLUDED.biography,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  what_i_do_title = EXCLUDED.what_i_do_title,
  what_i_do_description = EXCLUDED.what_i_do_description,
  updated_at = NOW();
