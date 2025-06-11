import { drizzle } from 'drizzle-orm/libsql/web';

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_TOKEN!,
  },
});
