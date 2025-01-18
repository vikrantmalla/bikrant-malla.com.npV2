// handlers/authHandlers.ts

import type { Context } from "hono";

import { sessionManager } from "../authConfig/Kinde";
import { kindeClient } from "../utils/KindeConfig";

type AuthHandler = (c: Context) => Promise<Response>;

export const handleLogin: AuthHandler = async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
};

export const handleRegister: AuthHandler = async (c) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
};

export const handleCallback: AuthHandler = async (c) => {
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
};

export const handleLogout: AuthHandler = async (c) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
};

export const handleProfileInfo: AuthHandler = async (c) => {
  const user = c.var["user"];
  return c.json({ user });
};
