import type { BetterAuthRateLimitOptions, RateLimit } from "better-auth";

export interface UpstashRateLimitClient {
  get: <TData = unknown>(
    key: string,
  ) => Promise<TData | null | undefined> | TData | null | undefined;
  set: (
    key: string,
    value: unknown,
    options?: { ex?: number },
  ) => Promise<unknown> | unknown;
}

export interface UpstashRateLimiterOptions extends Omit<
  BetterAuthRateLimitOptions,
  "customStorage" | "storage"
> {
  /**
   * Existing Redis client instance (for example from @upstash/redis).
   */
  redis: UpstashRateLimitClient;
}

export type UpstashRateLimitStorageEntry = Pick<
  RateLimit,
  "key" | "count" | "lastRequest"
>;
