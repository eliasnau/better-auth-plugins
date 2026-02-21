import type { BotIdCaptchaRoute, BotIdCheckMode } from "./types.js";
import { EXTERNAL_ERROR_CODES } from "./error-codes.js";

export const PLUGIN_ID = "botIdCaptcha";
export const DEFAULT_CHECK_MODE: BotIdCheckMode = "basic";

export const DEFAULT_ROUTES: BotIdCaptchaRoute[] = [
  { pathPrefix: "/sign-up/email", method: "POST", checkMode: "basic" },
  { pathPrefix: "/sign-in/email", method: "POST", checkMode: "basic" },
];

export const PUBLIC_ERROR_CODE_MAP = {
  BOT_DETECTED: EXTERNAL_ERROR_CODES.BOT_DETECTED,
  VERIFICATION_FAILED: EXTERNAL_ERROR_CODES.VERIFICATION_FAILED,
  UNKNOWN_ERROR: EXTERNAL_ERROR_CODES.UNKNOWN_ERROR,
} as const;
