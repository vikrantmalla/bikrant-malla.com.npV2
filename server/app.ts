import { Hono } from "hono";
import { logger } from "hono/logger";

import { authRoute } from "./routes/auth";
import { exampleRoute } from "./routes/example";

const app = new Hono();

app.use("*", logger());
app.basePath("/api").route("/example", exampleRoute).route("/", authRoute);

export default app;
