import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "gen-search-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        anchorsTarget?: "_blank" | "_parent" | "_self" | "_top";
        alwaysOpened?: string;
        configId?: string;
        location?: string;
        placeholder?: string;
      };
    }
  }
}
