-- Insert sample homepage content
INSERT INTO homepage_content (
  hero_title, 
  hero_subtitle, 
  bio_title, 
  bio_content, 
  featured_book_id, 
  featured_video_id
) VALUES (
  'Dr. Sarah Johnson',
  'Transforming Leadership Through Strategic Vision and Authentic Communication',
  'About Dr. Sarah Johnson',
  'Dr. Sarah Johnson is a renowned leadership expert, keynote speaker, and bestselling author with over 20 years of experience helping organizations and individuals reach their full potential. She has spoken at Fortune 500 companies worldwide and authored multiple award-winning books on leadership, strategy, and personal development.',
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  bio_title = EXCLUDED.bio_title,
  bio_content = EXCLUDED.bio_content,
  updated_at = NOW();

-- Insert sample books
INSERT INTO books (
  id, title, description, category, price, cover_image_url, pdf_url, rating, review_count, featured
) VALUES 
(
  gen_random_uuid(),
  'Leadership Excellence: Building High-Performance Teams',
  'A comprehensive guide to developing exceptional leadership skills and creating teams that consistently deliver outstanding results. Learn proven strategies for motivation, communication, and strategic thinking.',
  'Leadership',
  '29.99',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  NULL,
  '4.8',
  127,
  true
),
(
  gen_random_uuid(),
  'Strategic Innovation: Future-Proofing Your Organization',
  'Discover how to build innovation into your organization''s DNA. This book provides frameworks for identifying opportunities, managing change, and staying ahead of market disruptions.',
  'Strategy',
  '34.99',
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop',
  NULL,
  '4.7',
  89,
  true
),
(
  gen_random_uuid(),
  'Authentic Communication: Leading with Impact',
  'Master the art of authentic communication to inspire, influence, and create lasting relationships. Includes practical tools for public speaking, difficult conversations, and team meetings.',
  'Communication',
  '24.99',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop',
  NULL,
  '4.9',
  203,
  false
),
(
  gen_random_uuid(),
  'Digital Leadership: Navigating the Modern Workplace',
  'A modern approach to leadership in the digital age. Learn how to lead remote teams, leverage technology, and build culture in virtual environments.',
  'Leadership',
  '27.99',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop',
  NULL,
  '4.6',
  154,
  false
);

-- Insert sample videos
INSERT INTO videos (
  id, title, description, platform, video_url, thumbnail_url, duration, views, featured
) VALUES 
(
  gen_random_uuid(),
  'The Future of Leadership: 5 Key Trends to Watch',
  'In this keynote presentation, Dr. Johnson explores the evolving landscape of leadership and shares insights on the skills leaders need to develop for future success.',
  'YouTube',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  '18:32',
  15420,
  true
),
(
  gen_random_uuid(),
  'Building Resilient Teams in Uncertain Times',
  'A LinkedIn Live session where Dr. Johnson discusses strategies for maintaining team performance and morale during challenging periods.',
  'LinkedIn',
  'https://www.linkedin.com/video/live/example',
  'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=600&h=400&fit=crop',
  '25:17',
  8950,
  true
),
(
  gen_random_uuid(),
  'Communication Masterclass: Difficult Conversations',
  'Learn how to navigate challenging conversations with confidence and empathy. This masterclass covers preparation, delivery, and follow-up strategies.',
  'YouTube',
  'https://www.youtube.com/watch?v=example2',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
  '32:45',
  22100,
  false
),
(
  gen_random_uuid(),
  'Innovation Workshop: Thinking Outside the Box',
  'Join Dr. Johnson for an interactive workshop on fostering innovation within your organization. Includes practical exercises and real-world case studies.',
  'Instagram',
  'https://www.instagram.com/tv/example',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
  '45:20',
  6780,
  false
);
