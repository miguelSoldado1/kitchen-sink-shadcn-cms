"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import type { JSX } from "react";

export function PasswordInput({ className, disabled, ref, ...props }: JSX.IntrinsicElements["input"]) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        autoComplete="current-password"
        disabled={disabled}
        ref={ref}
      />
      <Button
        type="button"
        variant="link"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="fill-accent size-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="fill-accent size-4" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
      .hide-password-toggle::-ms-reveal,
      .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
      }
  `}</style>
    </div>
  );
}
