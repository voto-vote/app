import { createLucideIcon } from "lucide-react";
import { siGithub } from "simple-icons";

export const Bookmark = createLucideIcon("bookmark", [
  [
    "path",
    {
      d: "m19 21-7-4-7 4v-18h14z",
      key: "8gv6c4",
    },
  ],
]);

export const GitHub = createLucideIcon(siGithub.slug, [
  ["path", { d: siGithub.path }],
]);
