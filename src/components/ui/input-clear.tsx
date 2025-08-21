"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface InputClearProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
}

export function InputClear({ className, onClear, ...props }: InputClearProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onClear) {
      onClear();
    }
  };

  const showClearButton = props.value ? props.value.toString().length > 0 : false;

  return (
    <div className="relative">
      <Input ref={inputRef} className={cn("pe-9", className)} type="text" {...props} />
      {showClearButton && (
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear input"
          onClick={handleClearInput}
        >
          <CircleXIcon size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
