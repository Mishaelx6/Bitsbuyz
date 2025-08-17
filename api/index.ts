import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes
const server = registerRoutes(app);

// Export the Express app for Vercel
export default app;
