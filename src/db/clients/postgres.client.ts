import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getEnvVar } from '../../utils/common.utils';

const queryClient = postgres(getEnvVar('DATABASE_URL'));
export const db = drizzle(queryClient);
