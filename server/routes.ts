import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { insertBookSchema, insertVideoSchema, insertHomepageContentSchema, insertSiteContentSchema, insertCartSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth route is handled in auth.ts

  // Homepage content routes
  app.put('/api/homepage', isAdmin, async (req, res) => {
    try {
      const validatedData = insertHomepageContentSchema.parse(req.body);
      const content = await storage.updateHomepageContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating homepage content:", error);
      res.status(500).json({ error: "Failed to update homepage content" });
    }
  });

  app.get('/api/homepage', async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching homepage content:", error);
      res.status(500).json({ message: "Failed to fetch homepage content" });
    }
  });



  // Site content routes
  app.put('/api/site-content', isAdmin, async (req, res) => {
    try {
      const validatedData = insertSiteContentSchema.parse(req.body);
      const content = await storage.updateSiteContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating site content:", error);
      res.status(500).json({ error: "Failed to update site content" });
    }
  });

  app.get('/api/site-content', async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });



  // Book routes
  app.get('/api/books', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        featured: req.query.featured === 'true',
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };
      
      const books = await storage.getBooks(filters);
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get('/api/books/:id', async (req, res) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.post('/api/books', isAdmin, async (req, res) => {
    try {
      const validatedBook = insertBookSchema.parse(req.body);
      const book = await storage.createBook(validatedBook);
      res.status(201).json(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  app.put('/api/books/:id', isAdmin, async (req, res) => {
    try {
      const validatedBook = insertBookSchema.partial().parse(req.body);
      const book = await storage.updateBook(req.params.id, validatedBook);
      res.json(book);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Failed to update book" });
    }
  });

  app.delete('/api/books/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteBook(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Failed to delete book" });
    }
  });

  // Video routes
  app.get('/api/videos', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        platform: req.query.platform as string,
        featured: req.query.featured === 'true',
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };
      
      const videos = await storage.getVideos(filters);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post('/api/videos', isAuthenticated, async (req, res) => {
    try {
      const validatedVideo = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedVideo);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put('/api/videos/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedVideo = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(req.params.id, validatedVideo);
      res.json(video);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete('/api/videos/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteVideo(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Cart routes
  app.get('/api/cart', async (req, res) => {
    try {
      const sessionId = req.sessionID || randomUUID();
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', async (req, res) => {
    try {
      const sessionId = req.sessionID || randomUUID();
      const cartItem = insertCartSchema.parse({
        ...req.body,
        sessionId,
      });
      const item = await storage.addToCart(cartItem);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.delete('/api/cart/:bookId', async (req, res) => {
    try {
      const sessionId = req.sessionID || randomUUID();
      await storage.removeFromCart(sessionId, req.params.bookId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', async (req, res) => {
    try {
      const sessionId = req.sessionID || randomUUID();
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Checkout and Payment routes
  app.post('/api/checkout', async (req, res) => {
    try {
      const { email } = req.body;
      const sessionId = req.sessionID || randomUUID();
      
      // Get cart items and calculate total
      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Get book details for each cart item
      const items = [];
      let total = 0;
      
      for (const cartItem of cartItems) {
        const book = await storage.getBook(cartItem.bookId);
        if (book) {
          const itemTotal = parseFloat(book.price) * (cartItem.quantity || 1);
          total += itemTotal;
          items.push({
            bookId: book.id,
            title: book.title,
            price: book.price,
            quantity: cartItem.quantity,
            total: itemTotal,
          });
        }
      }

      // Create order
      const order = await storage.createOrder({
        sessionId,
        email,
        total: total.toString(),
        items,
      });

      // Initialize Paystack payment
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100), // Convert to kobo/cents
          reference: order.id,
          callback_url: `${req.protocol}://${req.get('host')}/api/paystack/callback`,
        }),
      });

      const paystackData = await paystackResponse.json();
      
      if (paystackData.status) {
        res.json({
          orderId: order.id,
          authorizationUrl: paystackData.data.authorization_url,
          reference: paystackData.data.reference,
        });
      } else {
        res.status(400).json({ message: "Payment initialization failed" });
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  app.get('/api/paystack/callback', async (req, res) => {
    try {
      const { reference } = req.query;
      
      // Verify payment with Paystack
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyData.status && verifyData.data.status === 'success') {
        // Update order status
        await storage.updateOrderStatus(reference as string, 'completed', reference as string);
        
        // Clear cart
        const order = await storage.getOrder(reference as string);
        if (order) {
          await storage.clearCart(order.sessionId);
        }
        
        res.redirect(`/checkout/success?reference=${reference}`);
      } else {
        await storage.updateOrderStatus(reference as string, 'failed');
        res.redirect(`/checkout/failed?reference=${reference}`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.redirect('/checkout/failed');
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
