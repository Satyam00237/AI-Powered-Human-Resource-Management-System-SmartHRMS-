import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend root if not already loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'smarthrms_default_dev_jwt_secret',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  IS_VERCEL: !!process.env.VERCEL,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is missing. Using fallback secret for development.');
}

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ WARNING: MONGODB_URI environment variable is missing. Database operations will fail.');
}

export default config;
export { config };
