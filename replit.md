# Dr. Sarah Johnson - Author & Leadership Platform

## Overview

This is a full-stack web application built for Dr. Sarah Johnson, a renowned book author, multinational speaker, and thought leader. The platform serves as a comprehensive digital presence featuring book sales, video content, and administrative capabilities. The application showcases leadership books, videos from various social platforms, and provides e-commerce functionality with integrated payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✓ **Authentication System Overhaul**: Replaced Replit Auth with traditional username/password authentication
✓ **Modern Auth Interface**: Created beautiful two-column authentication page with login and registration forms
✓ **Security Implementation**: Added password hashing, secure sessions, and admin role protection
✓ **Navigation Updates**: Updated navbar to support traditional login/logout flow with proper state management
✓ **Database Schema Updates**: Modified user table to support username/password authentication with role-based access
✓ **Admin Protection**: Protected all content management endpoints with admin-only access
✓ **Bug Fixes**: Resolved React hooks violations and authentication redirect issues
✓ **E-commerce Header**: Redesigned navigation with professional e-commerce styling, search bar, and category filters
✓ **Hero Section Redesign**: Added rotating background images with smooth transitions focused on books, videos, and e-commerce themes
✓ **African-themed Imagery**: Implemented comprehensive African-themed background images with database management
✓ **Admin Background Controls**: Added complete admin interface for managing hero background images with preview and removal
✓ **Navbar Cleanup**: Removed top announcement bar section for cleaner navigation
✓ **Footer Updates**: Removed Resources section and Contact from Quick Links, changed branding to "bitsbuyz"
✓ **Currency Conversion**: Changed all currency symbols from $ to ₦ (naira) throughout the platform
✓ **Text Simplification**: Updated all "video courses" references to just "videos" across the platform
✓ **Navbar Simplification**: Removed category links (Leadership, Business, Self-Help, Bestsellers) and favorites icon, replaced with single "BitsBuyz Store" link
✓ **Store Coming Soon Page**: Created dedicated "Store Coming Soon" page with newsletter signup and feature previews
✓ **Google Drive Integration**: Replaced file upload system with Google Drive URL-based storage for PDFs and images
✓ **Admin Interface Update**: Changed admin book management to accept direct Google Drive sharing URLs instead of file uploads  
✓ **PDF.js Integration**: Enhanced PDF viewing experience with direct Google Drive PDF rendering using react-pdf library
✓ **URL Validation**: Added real-time validation for Google Drive URLs in admin interface
✓ **Enhanced PDF Viewer**: Implemented zoom controls, better error handling, and improved loading states for PDFs
✓ **Google Drive URL Conversion**: Automatic conversion of sharing URLs to direct access URLs for optimal performance

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **File Uploads**: Uppy library with AWS S3 integration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth integration using OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with structured error handling and logging middleware

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema including users, books, videos, homepage content, cart, and orders
- **Session Storage**: Dedicated sessions table for authentication persistence

### Key Features
- **E-commerce**: Shopping cart functionality with Paystack payment integration
- **Content Management**: Admin dashboard for managing books, videos, and homepage content
- **Media Handling**: Cloud storage integration (Google Cloud Storage) for file uploads
- **Search & Filtering**: Advanced filtering for books and videos by category, price, platform
- **Responsive Design**: Mobile-first approach with comprehensive UI components

### Security & Authentication
- **Authentication Provider**: Replit Auth with JWT token handling
- **Authorization**: Role-based access control for admin functionality
- **Session Security**: Secure session cookies with proper expiration
- **Environment Variables**: Secure configuration for database URLs and API keys

### Data Models
- **Books**: Title, description, pricing, categories, ratings, featured status
- **Videos**: Multi-platform video content with thumbnails and metadata
- **Homepage Content**: Dynamic content management for hero sections and biography
- **Cart & Orders**: Session-based shopping cart with order tracking
- **Users**: Profile management integrated with Replit Auth

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting for production data
- **Google Cloud Storage**: File and media asset storage
- **Replit Auth**: Authentication and user management service
- **Paystack**: Payment processing for book purchases

### Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Server-side bundling for production deployment

### UI/UX Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Icon library for consistent iconography
- **Font Awesome**: Additional icons for social media and branding

### Third-Party Integrations
- **Social Media Platforms**: YouTube, LinkedIn, Instagram video embedding
- **Email Services**: Contact form and newsletter functionality
- **Analytics**: Performance tracking and user behavior analysis