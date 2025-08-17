# Vercel Deployment Guide

This guide will help you deploy your ClientConnect application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a production database (recommended: Neon, Supabase, or Railway)
3. **Environment Variables**: Configure all required environment variables

## Step 1: Database Setup

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Run the database migration script:
   ```bash
   psql "your-connection-string" -f scripts/deploy-db.sql
   ```

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to SQL Editor and run the migration script from `scripts/deploy-db.sql`

## Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

### Optional Variables (based on your setup)
```
# Payment Processing
PAYSTACK_SECRET_KEY=your-paystack-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# File Storage
GOOGLE_APPLICATION_CREDENTIALS=your-google-credentials
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-s3-bucket-name

# Object Storage Paths
PUBLIC_OBJECT_SEARCH_PATHS=public/path1,public/path2
PRIVATE_OBJECT_DIR=private/directory
```

## Step 3: Deploy to Vercel

### Option A: Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Option B: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push

## Step 4: Post-Deployment

1. **Verify API Routes**: Test your API endpoints at `https://your-domain.vercel.app/api/...`
2. **Check Database Connection**: Ensure your app can connect to the production database
3. **Test Authentication**: Verify login/logout functionality works
4. **Monitor Logs**: Check Vercel function logs for any errors

## Important Notes

### Serverless Limitations
- **Cold Starts**: Your API may have cold start delays
- **Function Timeout**: Maximum execution time is 30 seconds
- **Memory**: Limited to 3000MB per function

### Database Considerations
- **Connection Pooling**: Use connection pooling for better performance
- **SSL**: Ensure your database connection uses SSL
- **Backup**: Set up regular database backups

### File Storage
- **CDN**: Use a CDN for static assets
- **Optimization**: Optimize images and videos before upload
- **Security**: Implement proper access controls

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Verify database is accessible from Vercel
   - Check firewall settings

2. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check TypeScript compilation errors
   - Verify build scripts are correct

3. **Runtime Errors**
   - Check Vercel function logs
   - Verify environment variables are set
   - Test locally with production environment

### Performance Optimization

1. **Bundle Size**
   - Use dynamic imports for large components
   - Implement code splitting
   - Optimize images and assets

2. **Database Queries**
   - Add proper indexes
   - Use connection pooling
   - Implement query caching where appropriate

3. **Static Assets**
   - Use Vercel's edge network
   - Implement proper caching headers
   - Optimize asset delivery

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review function logs in Vercel dashboard
3. Test locally with production environment variables
4. Check database connectivity and permissions

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Database connection uses SSL
- [ ] Session secrets are strong and unique
- [ ] API endpoints are properly protected
- [ ] File uploads are validated and secured
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)



