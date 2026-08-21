import { drizzle } from "drizzle-orm/d1";

import * as schema from "#/lib/database/schema";

export const getDb = (env: Env) => drizzle(env.DB, { schema });
