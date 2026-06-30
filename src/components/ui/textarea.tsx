import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring min-h-28 w-full rounded-[8px] border border-emerald/12 bg-white/88 px-5 py-4 text-sm text-foreground placeholder:text-muted shadow-[0_12px_34px_rgba(4,45,40,0.07)] transition focus:border-gold/55",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
