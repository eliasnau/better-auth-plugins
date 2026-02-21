# BotID Plugin for Better Auth

Use Vercel [BotID](https://vercel.com/botid) to protect Better Auth routes from automated traffic.

This package is a **server-side Better Auth plugin**. BotID still requires **client-side setup** in your Frontend so BotID signals are attached to protected requests. In these Docs, we cover the client setup for Next.js, but if you're using a different Frontend framework, check out the [BotID documentation](https://vercel.com/docs/botid/get-started) for client integration guides. The backend/this plugin works for all js backend Frameworks.

## What this plugin protects by default

If you use `botIdCaptchaPlugin()` with no options, it protects:

- `POST /sign-up/email` with `basic` mode
- `POST /sign-in/email` with `basic` mode

## Installation

### Install dependencies
```bash
pnpm add @better-auth-plugins/plugins better-auth botid
```

### Add the plugin to your auth config

```ts
import { betterAuth } from "better-auth";
import { botIdCaptchaPlugin } from "@better-auth-plugins/plugins/botid";

export const auth = betterAuth({
  plugins: [botIdCaptchaPlugin()],
});
```

## Configure the frontend to work with BotID

Those steps differ based on your Frontend framework. In this guide we will cover Next.js 15.3+. If you're using a different Frontend framework or older Next version, check out the [BotID documentation](https://vercel.com/docs/botid/get-started) for client integration guides.

Wrap your `next.config.ts with `withBotId`:

```ts
import { withBotId } from "botid/next/config";

const nextConfig = {
  // your existing Next.js config
};

export default withBotId(nextConfig);
```

## 3) Add BotID client protection

Create `instrumentation-client.ts`:

```ts
import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/sign-up/email",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
    {
      path: "/sign-in/email",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});
```



## Custom configuration

This plugin allows you to configure protected routes, check modes, error messages, and a development bypass mode. Here's an example of how to use these options:

```ts
import { betterAuth } from "better-auth";
import { botIdCaptchaPlugin } from "@better-auth-plugins/plugins/botid";

export const auth = betterAuth({
  plugins: [
    botIdCaptchaPlugin({
      defaultCheckMode: "basic",
      routes: [
        { pathPrefix: "/sign-up/email", method: "POST", checkMode: "deepAnalysis" },
        { pathPrefix: "/sign-in/email", method: "POST" },
      ],
      errorMessages: {
        botDetected: "Bot traffic blocked.",
        verificationFailed: "Captcha verification failed.",
      },
      developmentBypass: "HUMAN",
    }),
  ],
});
```

## Protecting other routes

You can specify any route to protect with BotID by adding it to the `routes` array in the plugin options. Each route can have its own `checkMode` (either `basic` or `deepAnalysis`), or it can fall back to the `defaultCheckMode` specified in the plugin options.

```ts
export const auth = betterAuth({
  plugins: [
    botIdCaptchaPlugin({
      defaultCheckMode: "basic", // default check mode for routes that don't specify their own
      routes: [
        { pathPrefix: "/sign-up/email", method: "POST", checkMode: "deepAnalysis" },
        { pathPrefix: "/sign-in/email", method: "POST" },
      ],
    }),
  ],
});
```

In the example above, the `/sign-up/email` route will be protected using `deepAnalysis` mode, while the `/sign-in/email` route will use the `defaultCheckMode` of `basic`.

## Debugging in Development

During local development, BotID behaves differently than in production to facilitate testing and development workflows. In development mode, checkBotId() always returns { isBot: false }, allowing all requests to pass through. This ensures your development workflow isn't interrupted by bot protection while building and testing features.

If you need to test BotID's different return values in local development, you can use the developmentBypass option:

```ts
export const auth = betterAuth({
  plugins: [
    botIdCaptchaPlugin({
      developmentBypass: "HUMAN", // Available options: "HUMAN", "BAD-BOT", "GOOD-BOT", "ALLOWED"
    }),
  ],
});
```
The `developmentBypass` option only works in development mode and is ignored in production. In production, BotID always performs real bot detection.

## Plugin options

- `routes?: BotIdCaptchaRoute[]`
- `defaultCheckMode?: "basic" | "deepAnalysis"`
- `developmentBypass?: "HUMAN" | "BAD-BOT" | "GOOD-BOT" | "ALLOWED"`
- `errorMessages?: { botDetected?, verificationFailed?, unknown? }`

## Required alignment

- Every route verified by server must be listed in BotID client protection.
- `checkLevel` must match per route between client and server (`basic` / `deepAnalysis`).

## Official references

- https://vercel.com/docs/botid/get-started
- https://vercel.com/docs/botid/configuration
