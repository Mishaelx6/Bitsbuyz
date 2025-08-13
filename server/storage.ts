import {
  users,
  books,
  videos,
  homepageContent,
  siteContent,
  cart,
  orders,
  bookPurchases,
  type User,
  type UpsertUser,
  type InsertUser,
  type Book,
  type InsertBook,
  type Video,
  type InsertVideo,
  type HomepageContent,
  type InsertHomepageContent,
  type SiteContent,
  type InsertSiteContent,
  type Cart,
  type InsertCart,
  type Order,
  type InsertOrder,
  type BookPurchase,
  type InsertBookPurchase,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Book operations
  getBooks(filters?: BookFilters): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, book: Partial<InsertBook>): Promise<Book>;
  deleteBook(id: string): Promise<void>;

  // Video operations
  getVideos(filters?: VideoFilters): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: string): Promise<void>;

  // Homepage content operations
  getHomepageContent(): Promise<HomepageContent | undefined>;
  updateHomepageContent(content: InsertHomepageContent): Promise<HomepageContent>;

  // Site content operations
  getSiteContent(): Promise<SiteContent | undefined>;
  updateSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  // Cart operations
  getCartItems(sessionId: string): Promise<Cart[]>;
  addToCart(item: InsertCart): Promise<Cart>;
  removeFromCart(sessionId: string, bookId: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string, paystackReference?: string): Promise<Order>;

  // Book purchase operations
  getBookPurchase(userId: string, bookId: string): Promise<BookPurchase | undefined>;
  createBookPurchase(purchase: InsertBookPurchase): Promise<BookPurchase>;
  updateBookPurchase(id: string, purchase: Partial<InsertBookPurchase>): Promise<BookPurchase>;
  updateReadingProgress(userId: string, bookId: string, currentPage: number): Promise<BookPurchase>;
}

export interface BookFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'title' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface VideoFilters {
  search?: string;
  platform?: string;
  featured?: boolean;
  sortBy?: 'title' | 'views' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Book operations
  async getBooks(filters: BookFilters = {}): Promise<Book[]> {
    let query = db.select().from(books);
    const conditions = [];

    if (filters.search) {
      conditions.push(like(books.title, `%${filters.search}%`));
    }
    if (filters.category) {
      conditions.push(eq(books.category, filters.category));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(gte(books.price, filters.minPrice.toString()));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(books.price, filters.maxPrice.toString()));
    }
    if (filters.featured !== undefined) {
      conditions.push(eq(books.featured, filters.featured));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    if (sortBy === 'title') {
      query = query.orderBy(sortOrder === 'asc' ? asc(books.title) : desc(books.title));
    } else if (sortBy === 'price') {
      query = query.orderBy(sortOrder === 'asc' ? asc(books.price) : desc(books.price));
    } else if (sortBy === 'rating') {
      query = query.orderBy(sortOrder === 'asc' ? asc(books.rating) : desc(books.rating));
    } else {
      query = query.orderBy(sortOrder === 'asc' ? asc(books.createdAt) : desc(books.createdAt));
    }

    return await query;
  }

  async getBook(id: string): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(book: InsertBook): Promise<Book> {
    const [newBook] = await db.insert(books).values(book).returning();
    return newBook;
  }

  async updateBook(id: string, book: Partial<InsertBook>): Promise<Book> {
    const [updatedBook] = await db
      .update(books)
      .set({ ...book, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return updatedBook;
  }

  async deleteBook(id: string): Promise<void> {
    await db.delete(books).where(eq(books.id, id));
  }

  // Video operations
  async getVideos(filters: VideoFilters = {}): Promise<Video[]> {
    let query = db.select().from(videos);
    const conditions = [];

    if (filters.search) {
      conditions.push(like(videos.title, `%${filters.search}%`));
    }
    if (filters.platform) {
      conditions.push(eq(videos.platform, filters.platform));
    }
    if (filters.featured !== undefined) {
      conditions.push(eq(videos.featured, filters.featured));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    if (sortBy === 'title') {
      query = query.orderBy(sortOrder === 'asc' ? asc(videos.title) : desc(videos.title));
    } else if (sortBy === 'views') {
      query = query.orderBy(sortOrder === 'asc' ? asc(videos.views) : desc(videos.views));
    } else if (sortBy === 'platform') {
      query = query.orderBy(sortOrder === 'asc' ? asc(videos.platform) : desc(videos.platform));
    } else {
      query = query.orderBy(sortOrder === 'asc' ? asc(videos.createdAt) : desc(videos.createdAt));
    }

    return await query;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: string): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Homepage content operations
  async getHomepageContent(): Promise<HomepageContent | undefined> {
    const [content] = await db.select().from(homepageContent).limit(1);
    return content;
  }

  async updateHomepageContent(content: InsertHomepageContent): Promise<HomepageContent> {
    const existing = await this.getHomepageContent();
    
    if (existing) {
      const [updated] = await db
        .update(homepageContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(homepageContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(homepageContent).values(content).returning();
      return created;
    }
  }

  // Site content operations
  async getSiteContent(): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).limit(1);
    return content;
  }

  async updateSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const existing = await this.getSiteContent();
    
    if (existing) {
      const [updated] = await db
        .update(siteContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(siteContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteContent).values(content).returning();
      return created;
    }
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<Cart[]> {
    return await db.select().from(cart).where(eq(cart.sessionId, sessionId));
  }

  async addToCart(item: InsertCart): Promise<Cart> {
    // Check if item already exists in cart
    const [existing] = await db
      .select()
      .from(cart)
      .where(and(eq(cart.sessionId, item.sessionId), eq(cart.bookId, item.bookId)));

    if (existing) {
      // Update quantity
      const [updated] = await db
        .update(cart)
        .set({ quantity: (existing.quantity || 0) + (item.quantity || 1) })
        .where(eq(cart.id, existing.id))
        .returning();
      return updated;
    } else {
      // Add new item
      const [newItem] = await db.insert(cart).values(item).returning();
      return newItem;
    }
  }

  async removeFromCart(sessionId: string, bookId: string): Promise<void> {
    await db
      .delete(cart)
      .where(and(eq(cart.sessionId, sessionId), eq(cart.bookId, bookId)));
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cart).where(eq(cart.sessionId, sessionId));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async updateOrderStatus(id: string, status: string, paystackReference?: string): Promise<Order> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paystackReference) {
      updateData.paystackReference = paystackReference;
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Book purchase operations
  async getBookPurchase(userId: string, bookId: string): Promise<BookPurchase | undefined> {
    const [purchase] = await db
      .select()
      .from(bookPurchases)
      .where(and(eq(bookPurchases.userId, userId), eq(bookPurchases.bookId, bookId)));
    return purchase;
  }

  async createBookPurchase(purchase: InsertBookPurchase): Promise<BookPurchase> {
    const [newPurchase] = await db.insert(bookPurchases).values(purchase).returning();
    return newPurchase;
  }

  async updateBookPurchase(id: string, purchase: Partial<InsertBookPurchase>): Promise<BookPurchase> {
    const [updatedPurchase] = await db
      .update(bookPurchases)
      .set({ ...purchase, lastReadAt: new Date() })
      .where(eq(bookPurchases.id, id))
      .returning();
    return updatedPurchase;
  }

  async updateReadingProgress(userId: string, bookId: string, currentPage: number): Promise<BookPurchase> {
    const existing = await this.getBookPurchase(userId, bookId);
    
    if (existing) {
      const [updated] = await db
        .update(bookPurchases)
        .set({ currentPage, lastReadAt: new Date() })
        .where(eq(bookPurchases.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new purchase record if it doesn't exist
      const [created] = await db
        .insert(bookPurchases)
        .values({ userId, bookId, currentPage, lastReadAt: new Date() })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
