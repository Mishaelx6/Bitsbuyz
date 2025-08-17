import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

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
            siteName: "Bitsbuyz Stores",
            logoText: "bitsbuyz",
            navHome: "Home",
            navBooks: "Books",
            navVideos: "Videos",
            navAdmin: "Admin",
            booksPageTitle: "Book Library",
            booksPageSubtitle: "Explore our complete collection of books.",
            videosPageTitle: "Video Library",
            videosPageSubtitle: "Watch videos and insights.",
            footerDescription: "Your trusted destination for quality products and exceptional service.",
            footerCopyright: "© 2024 Bitsbuyz Stores. All rights reserved.",
            footerLinks: "Privacy Policy | Terms of Service",
            contactTitle: "Get In Touch",
            contactSubtitle: "Contact us for any inquiries.",
            contactButtonText: "Send Message",
            whatIDoTitle: "What We Do",
            whatIDoSubtitle: "We provide quality products and exceptional service.",
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
          tagline: 'Welcome to Bitsbuyz Stores',
          biography: 'Your trusted destination for quality products and exceptional service.',
          heroTitle: 'Welcome to Bitsbuyz Stores',
          heroSubtitle: 'Your trusted destination for quality products and exceptional service.',
          whatIDoTitle: 'What We Do',
          whatIDoDescription: 'We provide quality products and exceptional service to meet your needs.'
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
