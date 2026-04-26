"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

// Humne apni nanyi type banayi jo purani type mein 'children' add kar deti hai
interface MyThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: MyThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}