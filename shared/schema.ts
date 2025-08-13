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
import { createInsertSchema } from "drizzle-zod";
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
  siteName: varchar("site_name").notNull().default("Dr. Sarah Johnson"),
  logoText: varchar("logo_text", { length: 100 }).notNull().default("bitsbuyz"),
  // Navigation
  navHome: varchar("nav_home").notNull().default("Home"),
  navBooks: varchar("nav_books").notNull().default("Books"),
  navVideos: varchar("nav_videos").notNull().default("Videos"),
  navAdmin: varchar("nav_admin").notNull().default("Admin"),
  // Page headings
  booksPageTitle: varchar("books_page_title").notNull().default("Book Library"),
  booksPageSubtitle: text("books_page_subtitle").notNull().default("Explore our complete collection of leadership and personal development books."),
  videosPageTitle: varchar("videos_page_title").notNull().default("Video Library"),
  videosPageSubtitle: text("videos_page_subtitle").notNull().default("Watch keynotes, interviews, and thought leadership discussions from platforms worldwide."),
  // Footer content
  footerDescription: text("footer_description").notNull().default("Transforming leadership through authentic storytelling. Author, speaker, and executive coach helping leaders unlock their full potential."),
  footerCopyright: varchar("footer_copyright").notNull().default("© 2024 Dr. Sarah Johnson. All rights reserved."),
  footerLinks: varchar("footer_links").notNull().default("Privacy Policy | Terms of Service"),
  // Contact section
  contactTitle: varchar("contact_title").notNull().default("Ready to Transform Your Leadership?"),
  contactSubtitle: text("contact_subtitle").notNull().default("Let's start a conversation about your leadership journey and how we can work together to unlock your full potential."),
  contactButtonText: varchar("contact_button_text").notNull().default("Send Message"),
  // What I Do section
  whatIDoTitle: varchar("what_i_do_title").notNull().default("What I Do"),
  whatIDoSubtitle: text("what_i_do_subtitle").notNull().default("I help leaders and organizations unlock their full potential through three core pillars of transformation."),
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
export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookPurchaseSchema = createInsertSchema(bookPurchases).omit({
  id: true,
  purchaseDate: true,
  lastReadAt: true,
});
