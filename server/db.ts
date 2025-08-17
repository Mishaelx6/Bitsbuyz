import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// Configure WebSocket for Neon
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

// Check if we're in development mode and DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  DATABASE_URL not set in development mode. Some features may not work.');
    console.warn('   To set up a local database, create a .env file with:');
    console.warn('   DATABASE_URL=postgresql://username:password@localhost:5432/database');
    console.warn('   Or use a cloud database like Neon (neon.tech)');
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
}

console.log("Initializing database connection...");

// Create a mock connection for development if DATABASE_URL is not set
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL
  });
  db = drizzle({ client: pool, schema });
  console.log("Database connection initialized");
} else {
  console.log("⚠️  Running in development mode without database connection");
  // Create a mock db object for development
  db = {
    // Add mock methods that return empty results
    query: () => Promise.resolve([]),
    insert: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  };
}

export { pool, db };