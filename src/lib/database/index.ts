import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function createDatabase(env: { DATABASE: D1Database }) {
  return drizzle(env.DATABASE, { schema });
}
