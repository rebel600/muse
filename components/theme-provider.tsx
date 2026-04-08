import * as React from "react";
import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps & { children: React.ReactNode }) => {
  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  );
};