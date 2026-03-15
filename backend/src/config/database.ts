import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const isTsRuntime = __filename.endsWith('.ts');
const entityGlob = isTsRuntime
  ? path.join(__dirname, '../models/**/*.{ts,js}')
  : path.join(__dirname, '../models/**/*.js');
const migrationGlob = isTsRuntime
  ? path.join(__dirname, '../migrations/**/*.{ts,js}')
  : path.join(__dirname, '../migrations/**/*.js');

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME || 'aijiaoyu.db',
  synchronize: isDev,
  logging: isDev,
  entities: [entityGlob],
  migrations: [migrationGlob],
  subscribers: [],
});

export default AppDataSource;
