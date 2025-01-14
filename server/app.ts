import { Hono } from "hono";
import { logger } from "hono/logger";

import { exampleRoute } from "./routes/example";

const app = new Hono();

app.use("*", logger());
app.basePath("/api").route("/example", exampleRoute);

export default app;
