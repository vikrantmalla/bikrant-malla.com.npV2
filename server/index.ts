import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { Enviroment, ErrorType } from "@/shared/enum";
import type { ErrorResponse } from "@/shared/types";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return (
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status ?? 500,
      )
    );
  }

  // Handle generic errors
  const errorMessage =
    process.env.NODE_ENV === Enviroment.PRODUCTION
      ? ErrorType.InternalServerError
      : err.stack || err.message;

  return c.json<ErrorResponse>(
    {
      success: false,
      error: errorMessage,
    },
    500,
  );
});

export default app;
