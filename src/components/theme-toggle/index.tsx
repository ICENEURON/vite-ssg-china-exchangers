import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../utils/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="navigation"
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label="Toggle theme"
      className="text-navbar-foreground hover:text-navbar-foreground hover:bg-accent/40"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
