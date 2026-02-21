import type { BetterAuthPlugin } from "better-auth";
import { APIError } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/plugins";
import { checkBotId } from "botid/server";
import {
  DEFAULT_CHECK_MODE,
  DEFAULT_ROUTES,
  PLUGIN_ID,
  PUBLIC_ERROR_CODE_MAP,
} from "./constants.js";
import { EXTERNAL_ERROR_CODES, INTERNAL_ERROR_CODES } from "./error-codes.js";
import { getMethodFromContext, routeMatches } from "./matching.js";
import type {
  BotIdCaptchaPluginOptions,
  BotIdCheckMode,
  BotIdCheckOptions,
  BotIdDevelopmentBypass,
} from "./types.js";

const buildCheckOptions = (
  mode: BotIdCheckMode,
  developmentBypass: BotIdDevelopmentBypass | undefined,
): BotIdCheckOptions => {
  return {
    ...(developmentBypass
      ? { developmentOptions: { bypass: developmentBypass } }
      : {}),
    advancedOptions: {
      checkLevel: mode,
    },
  };
};

export const botIdCaptchaPlugin = (options: BotIdCaptchaPluginOptions = {}) => {
  const routes = options.routes?.length ? options.routes : DEFAULT_ROUTES;

  if (routes.some((route) => !route.pathPrefix)) {
    throw new Error(INTERNAL_ERROR_CODES.INVALID_ROUTE_CONFIG);
  }

  return {
    id: PLUGIN_ID,
    hooks: {
      before: [
        {
          matcher: (context) => {
            const method = getMethodFromContext(context);
            return routes.some((route) =>
              routeMatches(route, context.path, method),
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const method = getMethodFromContext(ctx);
            const matchedRoute =
              routes.find((route) => routeMatches(route, ctx.path, method)) ??
              null;

            if (!matchedRoute) {
              return { context: ctx };
            }

            const checkMode =
              matchedRoute.checkMode ??
              options.defaultCheckMode ??
              DEFAULT_CHECK_MODE;

            try {
              const verification = await checkBotId(
                buildCheckOptions(checkMode, options.developmentBypass),
              );

              if (verification.isBot) {
                throw new APIError("FORBIDDEN", {
                  message:
                    options.errorMessages?.botDetected ??
                    EXTERNAL_ERROR_CODES.BOT_DETECTED,
                });
              }
            } catch (error) {
              if (error instanceof APIError) {
                throw error;
              }

              ctx.context.logger.error(
                INTERNAL_ERROR_CODES.BOTID_CHECK_FAILED,
                {
                  path: ctx.path,
                  method,
                  error,
                },
              );

              throw new APIError("INTERNAL_SERVER_ERROR", {
                message:
                  options.errorMessages?.verificationFailed ??
                  options.errorMessages?.unknown ??
                  EXTERNAL_ERROR_CODES.VERIFICATION_FAILED,
              });
            }

            return { context: ctx };
          }),
        },
      ],
    },
    $ERROR_CODES: PUBLIC_ERROR_CODE_MAP,
    options,
  } satisfies BetterAuthPlugin;
};
