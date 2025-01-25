import { Hono } from "hono";
import { logger } from "hono/logger";

import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());
app.basePath("/api").route("/", authRoute);

export default app;
