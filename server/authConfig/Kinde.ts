import { type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { db } from "@/adapter";
import { usersTable } from "@/db/schemas/auth";
import { kindeClient } from "@/utils/KindeConfig";
import {
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";

import { ErrorType } from "@/shared/enum";

// Session management utility
export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

// Middleware to authenticate and fetch user profile
type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ error: ErrorType.Unauthorized }, 401);
    }
    const user = await kindeClient.getUserProfile(manager);
    c.set("user", user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: ErrorType.Unauthorized }, 401);
  }
});

type UserProfile = {
  kindeId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  updatedAt: number;
};

export const saveOrUpdateUser = async (user: UserProfile): Promise<void> => {
  const { kindeId, email, firstName, lastName, updatedAt } = user;

  // Ensure updatedAt is a valid Unix timestamp
  const updatedAtDate = updatedAt ? new Date(updatedAt * 1000) : new Date();

  if (isNaN(updatedAtDate.getTime())) {
    throw new Error("Invalid updatedAt timestamp.");
  }

  await db
    .insert(usersTable)
    .values({
      kindeId,
      email,
      firstName,
      lastName,
      updatedAt: updatedAtDate,
    })
    .onConflictDoUpdate({
      target: usersTable.kindeId, // Update existing records based on Kinde ID
      set: {
        email,
        firstName,
        lastName,
        updatedAt: updatedAtDate,
      },
    });
};
