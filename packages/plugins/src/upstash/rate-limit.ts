import type {
  BetterAuthRateLimitOptions,
  BetterAuthRateLimitStorage,
  RateLimit,
} from "better-auth";
import type {
  UpstashRateLimitClient,
  UpstashRateLimiterOptions,
} from "./types.js";

const DEFAULT_WINDOW_SECONDS = 10;

export const createUpstashRateLimitStorage = (
  options: UpstashRateLimiterOptions,
): BetterAuthRateLimitStorage => {
  const redis: UpstashRateLimitClient = options.redis;
  const ttlSeconds = Math.max(
    1,
    Math.ceil(options.window ?? DEFAULT_WINDOW_SECONDS),
  );

  return {
    get: async (key) => {
      const data = await redis.get<RateLimit>(key);
      return data ?? null;
    },
    set: async (key, value) => {
      await redis.set(key, value, { ex: ttlSeconds });
    },
  } satisfies BetterAuthRateLimitStorage;
};

export const upstashRateLimiter = (
  options: UpstashRateLimiterOptions,
): BetterAuthRateLimitOptions => {
  const { redis, ...rateLimitOptions } = options;
  void redis;

  return {
    ...rateLimitOptions,
    customStorage: createUpstashRateLimitStorage(options),
  };
};
