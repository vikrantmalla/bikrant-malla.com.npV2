import { Hono } from "hono";

import {
  handleCallback,
  handleLogin,
  handleLogout,
  handleProfileInfo,
  handleRegister,
} from "@/handler/authHandler";

import { PATHS } from "@/shared/constant/paths";

import { getUser } from "../authConfig/Kinde";

export const authRoute = new Hono()
  .get(PATHS.LOGIN, handleLogin)
  .get(PATHS.REGISTER, handleRegister)
  .get(PATHS.CALLBACK, handleCallback)
  .get(PATHS.LOGOUT, handleLogout)
  .get(PATHS.PROFILE_INFO, getUser, handleProfileInfo);
