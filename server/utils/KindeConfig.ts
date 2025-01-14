import { ProcessEnv } from "@/utils/env";
import {
  createKindeServerClient,
  GrantType,
} from "@kinde-oss/kinde-typescript-sdk";

// Initialize Kinde client
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: ProcessEnv.KINDE_DOMAIN,
    clientId: ProcessEnv.KINDE_CLIENT_ID,
    clientSecret: ProcessEnv.KINDE_CLIENT_SECRET,
    redirectURL: ProcessEnv.KINDE_REDIRECT_URI,
    logoutRedirectURL: ProcessEnv.KINDE_LOGOUT_REDIRECT_URI,
  },
);
