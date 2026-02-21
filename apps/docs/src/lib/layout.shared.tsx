import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { HomeIcon } from "lucide-react";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "eliasnau",
  repo: "better-auth-plugins",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Better Auth Plugins",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        icon: <HomeIcon />,
        text: "Home",
        url: "/",
        secondary: false,
      },
    ],
  };
}
