import { registerRoutes } from '../server/routes';
import express from 'express';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes
const server = registerRoutes(app);

// Export the Express app for Vercel
export default app;
