import { defineConfig } from 'drizzle-kit';
import { getEnvVar } from './src/utils/common.utils';

export default defineConfig({
  schema: './src/db/rdb/db-schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnvVar('DATABASE_URL')
  },
});