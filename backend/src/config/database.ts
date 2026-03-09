import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME || 'aijiaoyu.db',
  synchronize: isDev,
  logging: isDev,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});

export default AppDataSource;
