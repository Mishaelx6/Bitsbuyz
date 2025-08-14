CREATE TABLE "book_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"book_id" varchar NOT NULL,
	"current_page" integer DEFAULT 1,
	"total_pages" integer DEFAULT 0,
	"has_paid" boolean DEFAULT false,
	"payment_id" varchar,
	"purchase_date" timestamp DEFAULT now(),
	"last_read_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"cover_image_url" varchar NOT NULL,
	"pdf_url" varchar,
	"category" varchar NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"page_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"book_id" varchar NOT NULL,
	"quantity" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "homepage_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_image_url" varchar NOT NULL,
	"tagline" text NOT NULL,
	"biography" text NOT NULL,
	"hero_title" text NOT NULL,
	"hero_subtitle" text NOT NULL,
	"what_i_do_title" text NOT NULL,
	"what_i_do_description" text NOT NULL,
	"background_images" text[],
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"paystack_reference" varchar,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" varchar DEFAULT 'Dr. Sarah Johnson' NOT NULL,
	"logo_text" varchar(100) DEFAULT 'bitsbuyz' NOT NULL,
	"nav_home" varchar DEFAULT 'Home' NOT NULL,
	"nav_books" varchar DEFAULT 'Books' NOT NULL,
	"nav_videos" varchar DEFAULT 'Videos' NOT NULL,
	"nav_admin" varchar DEFAULT 'Admin' NOT NULL,
	"books_page_title" varchar DEFAULT 'Book Library' NOT NULL,
	"books_page_subtitle" text DEFAULT 'Explore our complete collection of leadership and personal development books.' NOT NULL,
	"videos_page_title" varchar DEFAULT 'Video Library' NOT NULL,
	"videos_page_subtitle" text DEFAULT 'Watch keynotes, interviews, and thought leadership discussions from platforms worldwide.' NOT NULL,
	"footer_description" text DEFAULT 'Transforming leadership through authentic storytelling. Author, speaker, and executive coach helping leaders unlock their full potential.' NOT NULL,
	"footer_copyright" varchar DEFAULT '© 2024 Dr. Sarah Johnson. All rights reserved.' NOT NULL,
	"footer_links" varchar DEFAULT 'Privacy Policy | Terms of Service' NOT NULL,
	"contact_title" varchar DEFAULT 'Ready to Transform Your Leadership?' NOT NULL,
	"contact_subtitle" text DEFAULT 'Let''s start a conversation about your leadership journey and how we can work together to unlock your full potential.' NOT NULL,
	"contact_button_text" varchar DEFAULT 'Send Message' NOT NULL,
	"what_i_do_title" varchar DEFAULT 'What I Do' NOT NULL,
	"what_i_do_subtitle" text DEFAULT 'I help leaders and organizations unlock their full potential through three core pillars of transformation.' NOT NULL,
	"linkedin_url" varchar DEFAULT '#',
	"twitter_url" varchar DEFAULT '#',
	"youtube_url" varchar DEFAULT '#',
	"instagram_url" varchar DEFAULT '#',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar,
	"password" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"thumbnail_url" varchar NOT NULL,
	"video_url" varchar NOT NULL,
	"platform" varchar NOT NULL,
	"duration" varchar,
	"views" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");