import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbRewrite: process.env.DB_REWRITE,
  nodeEnv: process.env.NODE_ENV || 'development',
  get mongodbUri() {
    return `mongodb+srv://${this.dbUser}:${this.dbPassword}@${this.dbHost}/${this.dbName}?${this.dbRewrite}`;
  }
}; 