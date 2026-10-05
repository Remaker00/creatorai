"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";

/** Icon button for headers. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

/** Labelled switch for menus and settings. */
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <Switch checked={theme !== "light"} onCheckedChange={(dark) => setTheme(dark ? "dark" : "light")} label="Dark mode" disabled={theme === null} />
  );
}
