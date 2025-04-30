
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({ className, variant = "ghost", size = "icon" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-full bg-gray-800 dark:bg-gray-800 text-gray-300 dark:text-gray-300 ${className || ''}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ 
          scale: 1, 
          rotate: theme === "dark" ? 180 : 0,
          transition: { duration: 0.5, type: "spring", stiffness: 100 } 
        }}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-nexentry-blue" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
