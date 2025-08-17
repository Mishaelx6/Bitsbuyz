-- Production Database Deployment Script
-- Run this script on your production PostgreSQL database

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create index on sessions expire
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE,
  password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cover_image_url VARCHAR NOT NULL,
  pdf_url VARCHAR,
  category VARCHAR NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create book_purchases table
CREATE TABLE IF NOT EXISTS book_purchases (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  book_id VARCHAR NOT NULL,
  current_page INTEGER DEFAULT 1,
  total_pages INTEGER DEFAULT 0,
  has_paid BOOLEAN DEFAULT false,
  payment_id VARCHAR,
  purchase_date TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url VARCHAR NOT NULL,
  video_url VARCHAR NOT NULL,
  platform VARCHAR NOT NULL,
  duration VARCHAR,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR NOT NULL DEFAULT 'Dr. Sarah Johnson',
  logo_text VARCHAR(100) NOT NULL DEFAULT 'bitsbuyz',
  nav_home VARCHAR NOT NULL DEFAULT 'Home',
  nav_books VARCHAR NOT NULL DEFAULT 'Books',
  nav_videos VARCHAR NOT NULL DEFAULT 'Videos',
  nav_admin VARCHAR NOT NULL DEFAULT 'Admin',
  books_page_title VARCHAR NOT NULL DEFAULT 'Book Library',
  books_page_subtitle TEXT NOT NULL DEFAULT 'Explore our complete collection of leadership and personal development books.',
  videos_page_title VARCHAR NOT NULL DEFAULT 'Video Library',
  videos_page_subtitle TEXT NOT NULL DEFAULT 'Watch our curated collection of leadership and personal development videos.',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_image_url VARCHAR,
  tagline TEXT,
  biography TEXT,
  hero_title VARCHAR,
  hero_subtitle TEXT,
  what_i_do_title VARCHAR,
  what_i_do_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial homepage content
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
) ON CONFLICT (id) DO NOTHING;

-- Insert initial site content
INSERT INTO site_content (
  site_name,
  logo_text,
  nav_home,
  nav_books,
  nav_videos,
  nav_admin,
  books_page_title,
  books_page_subtitle,
  videos_page_title,
  videos_page_subtitle
) VALUES (
  'Dr. Sarah Johnson',
  'bitsbuyz',
  'Home',
  'Books',
  'Videos',
  'Admin',
  'Book Library',
  'Explore our complete collection of leadership and personal development books.',
  'Video Library',
  'Watch our curated collection of leadership and personal development videos.'
) ON CONFLICT (id) DO NOTHING;



