import type { BotIdCaptchaRoute } from "./types.js";

const methodMatches = (
  expectedMethod: string | undefined,
  actualMethod: string | undefined,
) => {
  if (!expectedMethod || !actualMethod) {
    return true;
  }

  return expectedMethod.toUpperCase() === actualMethod.toUpperCase();
};

export const getMethodFromContext = (
  ctx: { method?: unknown; headers?: Headers | undefined } | undefined,
) => {
  if (!ctx) {
    return undefined;
  }

  if (typeof ctx.method === "string") {
    return ctx.method;
  }

  return ctx.headers?.get("x-method") ?? undefined;
};

export const routeMatches = (
  route: BotIdCaptchaRoute,
  path: string | undefined,
  method: string | undefined,
) => {
  if (!path) {
    return false;
  }

  if (!path.startsWith(route.pathPrefix)) {
    return false;
  }

  return methodMatches(route.method, method);
};
