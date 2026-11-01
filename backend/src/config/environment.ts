import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'agri_setu_super_secret_jwt_key_hackfest_3_2025',
  JWT_EXPIRES_IN: '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/agrisetu',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  AGMARKNET_API_KEY: process.env.AGMARKNET_API_KEY || '',
};
