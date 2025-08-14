# ClientConnect - Leadership Development Platform

A full-stack web application for Dr. Sarah Johnson's leadership development business, featuring book sales, video content, and user management.

## 🚀 Features

- **User Authentication**: Secure login/logout with session management
- **Book Library**: Digital book sales with PDF delivery
- **Video Content**: Curated leadership and development videos
- **Admin Panel**: Content management and user administration
- **Payment Processing**: Stripe and Paystack integration
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Hook Form for forms
- TanStack Query for data fetching

### Backend
- Express.js + TypeScript
- Drizzle ORM for database operations
- PostgreSQL database
- Passport.js for authentication
- Express sessions for session management

### Infrastructure
- Vercel for hosting and deployment
- Neon/Supabase for PostgreSQL database
- Google Cloud Storage / AWS S3 for file storage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ClientConnect-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build:prod
   ```

2. **Deploy to your preferred hosting platform**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run build:prod` - Production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📁 Project Structure

```
ClientConnect-1/
├── api/                 # Vercel API routes
├── client/              # React frontend
│   ├── src/            # Source code
│   └── index.html      # HTML template
├── server/              # Express backend
│   ├── routes.ts       # API routes
│   ├── auth.ts         # Authentication logic
│   ├── db.ts           # Database connection
│   └── index.ts        # Server entry point
├── shared/              # Shared types and schemas
├── scripts/             # Build and deployment scripts
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## 🌐 Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Environment (development/production)

See `env.example` for complete list of variables.

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `books` - Digital book catalog
- `videos` - Video content library
- `book_purchases` - User book purchases
- `site_content` - Site configuration and content
- `homepage_content` - Homepage customization
- `sessions` - User session storage

## 🔐 Authentication

- **Replit Auth**: OIDC-based authentication (development)
- **Session-based**: Express sessions with PostgreSQL storage
- **Role-based access**: User and admin roles

## 💳 Payment Integration

- **Stripe**: Primary payment processor
- **Paystack**: Alternative payment processor
- **Secure transactions**: PCI-compliant payment handling

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for responsive utilities
- Optimized for all device sizes

## 🚀 Performance

- Vite for fast development builds
- ESBuild for optimized production builds
- Code splitting and lazy loading
- Optimized bundle sizes

## 🔒 Security

- Environment variable protection
- SQL injection prevention with Drizzle ORM
- XSS protection
- CSRF protection
- Secure session management

## 📈 Monitoring

- Vercel function logs
- Database query monitoring
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For deployment issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review Vercel function logs
3. Verify environment variables
4. Check database connectivity

For development issues:
1. Check TypeScript compilation
2. Verify dependencies are installed
3. Check environment configuration
4. Review console errors

## 🔄 Updates

- Keep dependencies updated regularly
- Monitor for security vulnerabilities
- Test thoroughly before deploying updates
- Maintain database migration scripts
