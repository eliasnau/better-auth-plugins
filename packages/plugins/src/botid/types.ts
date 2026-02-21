import { checkBotId } from "botid/server";

export type BotIdCheckOptions = Parameters<typeof checkBotId>[0];
export type BotIdCheckMode = NonNullable<
  NonNullable<BotIdCheckOptions>["advancedOptions"]
>["checkLevel"];
export type BotIdDevelopmentBypass = NonNullable<
  NonNullable<BotIdCheckOptions>["developmentOptions"]
>["bypass"];

export interface BotIdCaptchaRoute {
  pathPrefix: string;
  method?: string;
  checkMode?: BotIdCheckMode;
}

export interface BotIdCaptchaErrorMessages {
  botDetected?: string;
  verificationFailed?: string;
  unknown?: string;
}

export interface BotIdCaptchaPluginOptions {
  /**
   * Protected routes.
   * Default:
   * - POST /sign-up/email
   * - POST /sign-in/email
   */
  routes?: BotIdCaptchaRoute[];
  /**
   * Default check mode for routes without explicit checkMode.
   * Default: "basic"
   */
  defaultCheckMode?: BotIdCheckMode;
  /**
   * Development bypass value forwarded to BotID.
   */
  developmentBypass?: BotIdDevelopmentBypass;
  /**
   * Override user-facing error messages.
   */
  errorMessages?: BotIdCaptchaErrorMessages;
}
