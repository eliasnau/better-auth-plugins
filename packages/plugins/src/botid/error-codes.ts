import { defineErrorCodes } from "better-auth";
export { defineErrorCodes } from "better-auth";

export const EXTERNAL_ERROR_CODES = defineErrorCodes({
  BOT_DETECTED: "Bot detected. Access denied.",
  VERIFICATION_FAILED: "Bot verification failed",
  UNKNOWN_ERROR: "Something went wrong",
});

export const INTERNAL_ERROR_CODES = defineErrorCodes({
  BOTID_CHECK_FAILED: "BotID check invocation failed",
  INVALID_ROUTE_CONFIG: "Invalid BotID route config",
});
