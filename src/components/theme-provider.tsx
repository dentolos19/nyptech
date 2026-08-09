import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ComponentProps } from "react";

export default function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider
      attribute={"class"}
      defaultTheme={"light"}
      forcedTheme={"light"}
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}
