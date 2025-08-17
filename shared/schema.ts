import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Books table
export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  coverImageUrl: varchar("cover_image_url").notNull(),
  pdfUrl: varchar("pdf_url"),
  category: varchar("category").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  pageCount: integer("page_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Book purchases table - tracks user purchases and reading progress
export const bookPurchases = pgTable("book_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  bookId: varchar("book_id").notNull(),
  currentPage: integer("current_page").default(1),
  totalPages: integer("total_pages").default(0),
  hasPaid: boolean("has_paid").default(false),
  paymentId: varchar("payment_id"),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  lastReadAt: timestamp("last_read_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: varchar("thumbnail_url").notNull(),
  videoUrl: varchar("video_url").notNull(),
  platform: varchar("platform").notNull(), // YouTube, LinkedIn, Instagram
  duration: varchar("duration"), // e.g., "24:15"
  views: integer("views").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site content management table
export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Site branding
  siteName: varchar("site_name").notNull().default("BitsBuyz - Digital Learning Platform"),
  logoText: varchar("logo_text").notNull().default("BitsBuyz"),
  // Navigation
  navHome: varchar("nav_home").notNull().default("Home"),
  navBooks: varchar("nav_books").notNull().default("Digital Books"),
  navVideos: varchar("nav_videos").notNull().default("Videos"),
  navAdmin: varchar("nav_admin").notNull().default("Admin"),
  // Page headings
  booksPageTitle: varchar("books_page_title").notNull().default("Digital Book Library"),
  booksPageSubtitle: varchar("books_page_subtitle").notNull().default("Explore our complete collection of digital books and educational content."),
  videosPageTitle: varchar("videos_page_title").notNull().default("Video Library"),
  videosPageSubtitle: varchar("videos_page_subtitle").notNull().default("Watch educational videos and entertainment content."),
  // Footer content
  footerDescription: varchar("footer_description").notNull().default("BitsBuyz is a Nigerian based e-commerce startup delivering seamless digital learning experiences with premium quality content accessible 24/7."),
  footerCopyright: varchar("footer_copyright").notNull().default("© 2024 BitsBuyz. All rights reserved."),
  footerLinks: varchar("footer_links").notNull().default("Privacy Policy | Terms of Service"),
  // Contact section
  contactTitle: varchar("contact_title").notNull().default("Get In Touch"),
  contactSubtitle: varchar("contact_subtitle").notNull().default("Contact us for any inquiries about our digital learning platform."),
  contactButtonText: varchar("contact_button_text").notNull().default("Send Message"),
  // What I Do section
  whatIDoTitle: varchar("what_i_do_title").notNull().default("What We Do"),
  whatIDoSubtitle: varchar("what_i_do_subtitle").notNull().default("We provide seamless digital learning experiences with digital books, videos, and premium quality content accessible 24/7."),
  // Social links
  linkedinUrl: varchar("linkedin_url").default("#"),
  twitterUrl: varchar("twitter_url").default("#"),
  youtubeUrl: varchar("youtube_url").default("#"),
  instagramUrl: varchar("instagram_url").default("#"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Homepage content table
export const homepageContent = pgTable("homepage_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileImageUrl: varchar("profile_image_url").notNull(),
  tagline: text("tagline").notNull(),
  biography: text("biography").notNull(),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  whatIDoTitle: text("what_i_do_title").notNull(),
  whatIDoDescription: text("what_i_do_description").notNull(),
  backgroundImages: text("background_images").array(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cart table
export const cart = pgTable("cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  bookId: varchar("book_id").references(() => books.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  email: varchar("email").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default('pending'), // pending, completed, failed
  paystackReference: varchar("paystack_reference"),
  items: jsonb("items").notNull(), // Array of book items
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertBook = typeof books.$inferInsert;
export type Book = typeof books.$inferSelect;

export type InsertVideo = typeof videos.$inferInsert;
export type Video = typeof videos.$inferSelect;

export type InsertSiteContent = typeof siteContent.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;

export type InsertHomepageContent = typeof homepageContent.$inferInsert;
export type HomepageContent = typeof homepageContent.$inferSelect;

export type InsertCart = typeof cart.$inferInsert;
export type Cart = typeof cart.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export type InsertBookPurchase = typeof bookPurchases.$inferInsert;
export type BookPurchase = typeof bookPurchases.$inferSelect;

// Zod schemas for validation
export const insertBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  coverImageUrl: z.string().url("Cover image URL must be valid"),
  pdfUrl: z.string().url("PDF URL must be valid"),
  category: z.string().min(1, "Category is required"),
  pageCount: z.number().int().positive("Page count must be a positive integer"),
  featured: z.boolean().default(false),
});

export const insertVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().url("Thumbnail URL must be valid"),
  videoUrl: z.string().url("Video URL must be valid"),
  platform: z.string().min(1, "Platform is required"),
  featured: z.boolean().default(false),
  duration: z.string().optional(),
  views: z.number().int().nonnegative("Views must be non-negative").default(0),
});

export const insertSiteContentSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  logoText: z.string().min(1, "Logo text is required"),
  navHome: z.string().min(1, "Navigation home text is required"),
  navBooks: z.string().min(1, "Navigation books text is required"),
  navVideos: z.string().min(1, "Navigation videos text is required"),
  navAdmin: z.string().min(1, "Navigation admin text is required"),
  booksPageTitle: z.string().min(1, "Books page title is required"),
  booksPageSubtitle: z.string().min(1, "Books page subtitle is required"),
  videosPageTitle: z.string().min(1, "Videos page title is required"),
  videosPageSubtitle: z.string().min(1, "Videos page subtitle is required"),
  footerDescription: z.string().min(1, "Footer description is required"),
  footerCopyright: z.string().min(1, "Footer copyright is required"),
  footerLinks: z.string().min(1, "Footer links are required"),
  contactTitle: z.string().min(1, "Contact title is required"),
  contactSubtitle: z.string().min(1, "Contact subtitle is required"),
  contactButtonText: z.string().min(1, "Contact button text is required"),
  whatIDoTitle: z.string().min(1, "What I do title is required"),
  whatIDoSubtitle: z.string().min(1, "What I do subtitle is required"),
  linkedinUrl: z.string().url("LinkedIn URL must be valid").optional(),
  twitterUrl: z.string().url("Twitter URL must be valid").optional(),
  youtubeUrl: z.string().url("YouTube URL must be valid").optional(),
  instagramUrl: z.string().url("Instagram URL must be valid").optional(),
});

export const insertHomepageContentSchema = z.object({
  profileImageUrl: z.string().url("Profile image URL must be valid"),
  tagline: z.string().min(1, "Tagline is required"),
  biography: z.string().min(1, "Biography is required"),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  whatIDoTitle: z.string().min(1, "What I do title is required"),
  whatIDoDescription: z.string().min(1, "What I do description is required"),
  backgroundImages: z.array(z.string()).default([]),
});

export const insertCartSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  bookId: z.string().min(1, "Book ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer").default(1),
});

export const insertOrderSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  email: z.string().email("Valid email is required"),
  total: z.string().regex(/^\d+(\.\d{1,2})?$/, "Total must be a valid decimal number"),
  status: z.string().default('pending'),
  paystackReference: z.string().optional(),
  items: z.array(z.any()).min(1, "Order must contain at least one item"),
});

export const insertBookPurchaseSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bookId: z.string().min(1, "Book ID is required"),
  currentPage: z.number().int().nonnegative("Current page must be non-negative").default(0),
  hasPaid: z.boolean().default(false),
  paymentId: z.string().optional(),
});

// Partial schemas for updates
export const updateBookSchema = insertBookSchema.partial();
export const updateVideoSchema = insertVideoSchema.partial();
export const updateSiteContentSchema = insertSiteContentSchema.partial();
export const updateHomepageContentSchema = insertHomepageContentSchema.partial();
export const updateCartSchema = insertCartSchema.partial();
export const updateOrderSchema = insertOrderSchema.partial();
export const updateBookPurchaseSchema = insertBookPurchaseSchema.partial();
