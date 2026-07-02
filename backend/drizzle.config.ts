import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/pg-schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://citymotion_user:citymotion_pass@localhost:5432/citymotion',
  },
});
