import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import { usersTable } from "./db/schemas/auth";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);
console.log(queryClient)
export const db = drizzle(queryClient, {
  schema: {
    user: usersTable,
  },
});
