import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// Configure WebSocket for Neon
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

// Initialize database connection
let db: any = null;
if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

// Simple storage implementation for Vercel API routes
const storage = {
  // Site content operations
  async getSiteContent() {
    if (!db) return null;
    try {
      const [content] = await db.select().from(schema.siteContent).limit(1);
      return content;
    } catch (error) {
      console.error('Error fetching site content:', error);
      return null;
    }
  },

  async updateSiteContent(content: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [updated] = await db
        .insert(schema.siteContent)
        .values(content)
        .onConflictDoUpdate({
          target: schema.siteContent.id,
          set: content
        })
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating site content:', error);
      throw error;
    }
  },

  // Book operations
  async getBooks(filters: any = {}) {
    if (!db) return [];
    try {
      let query = db.select().from(schema.books);
      const conditions: any[] = [];

      if (filters.search) {
        conditions.push(like(schema.books.title, `%${filters.search}%`));
      }
      if (filters.category) {
        conditions.push(eq(schema.books.category, filters.category));
      }
      if (filters.featured !== undefined) {
        conditions.push(eq(schema.books.featured, filters.featured));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      
      if (sortBy === 'title') {
        query = query.orderBy(sortOrder === 'asc' ? asc(schema.books.title) : desc(schema.books.title));
      } else {
        query = query.orderBy(sortOrder === 'asc' ? asc(schema.books.createdAt) : desc(schema.books.createdAt));
      }

      return await query;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  async getBook(id: string) {
    if (!db) return null;
    try {
      const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id));
      return book;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  },

  async createBook(book: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [newBook] = await db.insert(schema.books).values(book).returning();
      return newBook;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  async updateBook(id: string, book: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [updatedBook] = await db
        .update(schema.books)
        .set({ ...book, updatedAt: new Date() })
        .where(eq(schema.books.id, id))
        .returning();
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  async deleteBook(id: string) {
    if (!db) throw new Error('Database not connected');
    try {
      await db.delete(schema.books).where(eq(schema.books.id, id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  // Video operations
  async getVideos(filters: any = {}) {
    if (!db) return [];
    try {
      let query = db.select().from(schema.videos);
      const conditions: any[] = [];

      if (filters.search) {
        conditions.push(like(schema.videos.title, `%${filters.search}%`));
      }
      if (filters.platform) {
        conditions.push(eq(schema.videos.platform, filters.platform));
      }
      if (filters.featured !== undefined) {
        conditions.push(eq(schema.videos.featured, filters.featured));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      
      if (sortBy === 'title') {
        query = query.orderBy(sortOrder === 'asc' ? asc(schema.videos.title) : desc(schema.videos.title));
      } else {
        query = query.orderBy(sortOrder === 'asc' ? asc(schema.videos.createdAt) : desc(schema.videos.createdAt));
      }

      return await query;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  async getVideo(id: string) {
    if (!db) return null;
    try {
      const [video] = await db.select().from(schema.videos).where(eq(schema.videos.id, id));
      return video;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  },

  async createVideo(video: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [newVideo] = await db.insert(schema.videos).values(video).returning();
      return newVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  },

  async updateVideo(id: string, video: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [updatedVideo] = await db
        .update(schema.videos)
        .set({ ...video, updatedAt: new Date() })
        .where(eq(schema.videos.id, id))
        .returning();
      return updatedVideo;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  async deleteVideo(id: string) {
    if (!db) throw new Error('Database not connected');
    try {
      await db.delete(schema.videos).where(eq(schema.videos.id, id));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // User operations
  async createUser(user: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [newUser] = await db.insert(schema.users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByUsername(username: string) {
    if (!db) return null;
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Cart operations
  async getCartItems(sessionId: string) {
    if (!db) return [];
    try {
      return await db.select().from(schema.cart).where(eq(schema.cart.sessionId, sessionId));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  },

  async addToCart(item: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [cartItem] = await db.insert(schema.cart).values(item).returning();
      return cartItem;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async removeFromCart(sessionId: string, bookId: string) {
    if (!db) throw new Error('Database not connected');
    try {
      await db
        .delete(schema.cart)
        .where(and(eq(schema.cart.sessionId, sessionId), eq(schema.cart.bookId, bookId)));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Homepage content operations
  async getHomepageContent() {
    if (!db) return null;
    try {
      const [content] = await db.select().from(schema.homepageContent).limit(1);
      return content;
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      return null;
    }
  },

  async updateHomepageContent(content: any) {
    if (!db) throw new Error('Database not connected');
    try {
      const [updated] = await db
        .insert(schema.homepageContent)
        .values(content)
        .onConflictDoUpdate({
          target: schema.homepageContent.id,
          set: content
        })
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating homepage content:', error);
      throw error;
    }
  }
};

// Import Drizzle operators
import { eq, and, like, asc, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    // Health check endpoint
    if (pathname === '/api/health' && req.method === 'GET') {
      return res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'API is running',
        database: process.env.DATABASE_URL ? 'connected' : 'not configured'
      });
    }

    // Site content endpoint
    if (pathname === '/api/site-content') {
      if (req.method === 'GET') {
        try {
          const content = await storage.getSiteContent();
          return res.json(content || {
            siteName: "BitsBuyz - Digital Learning Platform",
            logoText: "BitsBuyz",
            navHome: "Home",
            navBooks: "Digital Books",
            navVideos: "Videos",
            navAdmin: "Admin",
            booksPageTitle: "Digital Book Library",
            booksPageSubtitle: "Explore our complete collection of digital books and educational content.",
            videosPageTitle: "Video Library",
            videosPageSubtitle: "Watch educational videos and entertainment content.",
            footerDescription: "BitsBuyz is a Nigerian based e-commerce startup delivering seamless digital learning experiences with premium quality content accessible 24/7.",
            footerCopyright: "© 2024 BitsBuyz. All rights reserved.",
            footerLinks: "Privacy Policy | Terms of Service",
            contactTitle: "Get In Touch",
            contactSubtitle: "Contact us for any inquiries about our digital learning platform.",
            contactButtonText: "Send Message",
            whatIDoTitle: "What We Do",
            whatIDoSubtitle: "We provide seamless digital learning experiences with digital books, videos, and premium quality content accessible 24/7.",
            linkedinUrl: "#",
            twitterUrl: "#",
            youtubeUrl: "#",
            instagramUrl: "#"
          });
        } catch (error) {
          console.error('Error fetching site content:', error);
          return res.status(500).json({ error: 'Failed to fetch site content' });
        }
      }
      
      if (req.method === 'PUT') {
        try {
          const content = await storage.updateSiteContent(req.body);
          return res.json(content);
        } catch (error) {
          console.error('Error updating site content:', error);
          return res.status(500).json({ error: 'Failed to update site content' });
        }
      }
    }

    // Books endpoint
    if (pathname === '/api/books' && req.method === 'GET') {
      try {
        const filters = {
          search: req.query.search as string,
          category: req.query.category as string,
          minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
          maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
          featured: req.query.featured === 'true' ? true : undefined,
          sortBy: req.query.sortBy as any,
          sortOrder: req.query.sortOrder as any,
        };
        
        const books = await storage.getBooks(filters);
        return res.json(books);
      } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Failed to fetch books' });
      }
    }

    // Create book endpoint
    if (pathname === '/api/books' && req.method === 'POST') {
      try {
        const book = await storage.createBook(req.body);
        return res.status(201).json(book);
      } catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({ error: 'Failed to create book' });
      }
    }

    // Individual book endpoint
    if (pathname.startsWith('/api/books/') && req.method === 'GET') {
      try {
        const bookId = pathname.split('/').pop();
        if (!bookId) {
          return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const book = await storage.getBook(bookId);
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        
        return res.json(book);
      } catch (error) {
        console.error('Error fetching book:', error);
        return res.status(500).json({ error: 'Failed to fetch book' });
      }
    }

    // Update book endpoint
    if (pathname.startsWith('/api/books/') && req.method === 'PUT') {
      try {
        const bookId = pathname.split('/').pop();
        if (!bookId) {
          return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const book = await storage.updateBook(bookId, req.body);
        return res.json(book);
      } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ error: 'Failed to update book' });
      }
    }

    // Delete book endpoint
    if (pathname.startsWith('/api/books/') && req.method === 'DELETE') {
      try {
        const bookId = pathname.split('/').pop();
        if (!bookId) {
          return res.status(400).json({ error: 'Book ID is required' });
        }
        
        await storage.deleteBook(bookId);
        return res.json({ message: 'Book deleted successfully' });
      } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({ error: 'Failed to delete book' });
      }
    }

    // Videos endpoint
    if (pathname === '/api/videos' && req.method === 'GET') {
      try {
        const filters = {
          search: req.query.search as string,
          platform: req.query.platform as string,
          featured: req.query.featured === 'true' ? true : undefined,
          sortBy: req.query.sortBy as any,
          sortOrder: req.query.sortOrder as any,
        };
        
        const videos = await storage.getVideos(filters);
        return res.json(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json({ error: 'Failed to fetch videos' });
      }
    }

    // Create video endpoint
    if (pathname === '/api/videos' && req.method === 'POST') {
      try {
        const video = await storage.createVideo(req.body);
        return res.status(201).json(video);
      } catch (error) {
        console.error('Error creating video:', error);
        return res.status(500).json({ error: 'Failed to create video' });
      }
    }

    // Individual video endpoint
    if (pathname.startsWith('/api/videos/') && req.method === 'GET') {
      try {
        const videoId = pathname.split('/').pop();
        if (!videoId) {
          return res.status(400).json({ error: 'Video ID is required' });
        }
        
        const video = await storage.getVideo(videoId);
        if (!video) {
          return res.status(404).json({ error: 'Video not found' });
        }
        
        return res.json(video);
      } catch (error) {
        console.error('Error fetching video:', error);
        return res.status(500).json({ error: 'Failed to fetch video' });
      }
    }

    // Update video endpoint
    if (pathname.startsWith('/api/videos/') && req.method === 'PUT') {
      try {
        const videoId = pathname.split('/').pop();
        if (!videoId) {
          return res.status(400).json({ error: 'Video ID is required' });
        }
        
        const video = await storage.updateVideo(videoId, req.body);
        return res.json(video);
      } catch (error) {
        console.error('Error updating video:', error);
        return res.status(500).json({ error: 'Failed to update video' });
      }
    }

    // Delete video endpoint
    if (pathname.startsWith('/api/videos/') && req.method === 'DELETE') {
      try {
        const videoId = pathname.split('/').pop();
        if (!videoId) {
          return res.status(400).json({ error: 'Video ID is required' });
        }
        
        await storage.deleteVideo(videoId);
        return res.json({ message: 'Video deleted successfully' });
      } catch (error) {
        console.error('Error deleting video:', error);
        return res.status(500).json({ error: 'Failed to delete video' });
      }
    }

    // User registration endpoint
    if (pathname === '/api/register' && req.method === 'POST') {
      try {
        const user = await storage.createUser(req.body);
        return res.status(201).json(user);
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Failed to create user' });
      }
    }

    // User login endpoint (basic implementation)
    if (pathname === '/api/login' && req.method === 'POST') {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Note: In production, you should hash passwords and use proper authentication
        // This is a basic implementation for now
        return res.json({ 
          message: 'Login successful',
          user: { id: user.id, username: user.username, email: user.email }
        });
      } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ error: 'Failed to process login' });
      }
    }

    // User endpoint
    if (pathname === '/api/user' && req.method === 'GET') {
      try {
        // This would typically check authentication
        return res.json({
          message: 'User endpoint - authentication required',
          authenticated: false
        });
      } catch (error) {
        console.error('Error in user endpoint:', error);
        return res.status(500).json({ error: 'Failed to process user request' });
      }
    }

    // Cart endpoint
    if (pathname === '/api/cart' && req.method === 'GET') {
      try {
        const sessionId = req.query.sessionId as string;
        if (!sessionId) {
          return res.json({ items: [], total: 0 });
        }
        
        const cartItems = await storage.getCartItems(sessionId);
        // For now, return cart items without calculating total (would need to join with books table)
        return res.json({ items: cartItems, total: 0 });
      } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ error: 'Failed to fetch cart' });
      }
    }

    // Add to cart endpoint
    if (pathname === '/api/cart' && req.method === 'POST') {
      try {
        const cartItem = await storage.addToCart(req.body);
        return res.status(201).json(cartItem);
      } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Failed to add to cart' });
      }
    }

    // Remove from cart endpoint
    if (pathname === '/api/cart' && req.method === 'DELETE') {
      try {
        const { sessionId, bookId } = req.body;
        if (!sessionId || !bookId) {
          return res.status(400).json({ error: 'Session ID and Book ID are required' });
        }
        
        await storage.removeFromCart(sessionId, bookId);
        return res.json({ message: 'Item removed from cart successfully' });
      } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({ error: 'Failed to remove from cart' });
      }
    }

    // Homepage endpoint
    if (pathname === '/api/homepage' && req.method === 'GET') {
      try {
        const content = await storage.getHomepageContent();
        return res.json(content || {
          profileImageUrl: 'https://example.com/default-profile.jpg',
          tagline: 'Digital Learning Platform',
          biography: 'BitsBuyz is a Nigerian based e-commerce startup built to deliver seamless, mobile-first online shopping Experience. BitsBuyz aim to capture a significant share in Nigeria growing e-commerce market projected to reach USD 33 Billion by 2026 while expanding globally through strategic partnership and innovative marketing.',
          heroTitle: 'Digital Learning Platform',
          heroSubtitle: 'Seamless Online Shopping Experience',
          whatIDoTitle: 'What We Do',
          whatIDoDescription: 'We provide seamless digital learning experiences with digital books, videos, and premium quality content accessible 24/7.',
          stats: {
            digitalBooks: '50+',
            videos: '25+',
            happyCustomers: '1000+'
          },
          features: [
            'Browse Digital Books',
            'Watch Videos', 
            'Instant Download',
            '24/7 Access',
            'Premium Quality'
          ]
        });
      } catch (error) {
        console.error('Error fetching homepage content:', error);
        return res.status(500).json({ error: 'Failed to fetch homepage content' });
      }
    }

    // Update homepage content endpoint
    if (pathname === '/api/homepage' && req.method === 'PUT') {
      try {
        const content = await storage.updateHomepageContent(req.body);
        return res.json(content);
      } catch (error) {
        console.error('Error updating homepage content:', error);
        return res.status(500).json({ error: 'Failed to update homepage content' });
      }
    }

    // Default response for unhandled routes
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: pathname,
      method: req.method,
      message: 'This endpoint is not yet implemented in the Vercel API route'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
