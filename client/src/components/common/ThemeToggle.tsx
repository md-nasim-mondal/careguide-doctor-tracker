"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, Theme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  align?: "left" | "right";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  align = "right",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const options: { value: Theme; label: string; icon: string; desc: string }[] = [
    {
      value: "light",
      label: "Light",
      icon: "☀️",
      desc: "Bright mode",
    },
    {
      value: "dark",
      label: "Dark",
      icon: "🌙",
      desc: "Midnight slate",
    },
    {
      value: "system",
      label: "System",
      icon: "💻",
      desc: "Match device setting",
    },
  ];

  const currentIcon =
    theme === "system" ? "💻" : resolvedTheme === "dark" ? "🌙" : "☀️";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Color Theme"
        aria-expanded={isOpen}
        title={`Theme: ${theme === "system" ? `System (${resolvedTheme})` : theme}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground transition-all duration-150 cursor-pointer text-xs sm:text-sm font-medium shadow-2xs group"
      >
        <span className="text-sm transition-transform duration-200 group-hover:scale-110">
          {currentIcon}
        </span>
        {showLabel && (
          <span className="capitalize hidden sm:inline text-xs text-muted-foreground group-hover:text-foreground">
            {theme}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground transition-transform duration-150">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-48 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-md p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/60 mb-1">
            Theme Preference
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{opt.icon}</span>
                    <div className="text-left">
                      <p className="leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground font-normal">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-primary text-xs font-bold shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
