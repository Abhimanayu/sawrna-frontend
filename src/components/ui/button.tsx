import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition focus-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald text-white shadow-[0_12px_28px_rgba(4,45,40,0.18)] hover:bg-black",
        gold: "bg-gold text-emerald shadow-[0_12px_28px_rgba(200,167,106,0.24)] hover:bg-white hover:text-emerald",
        outline: "border border-emerald/16 bg-white/72 text-emerald shadow-[0_10px_26px_rgba(4,45,40,0.06)] hover:border-gold/55 hover:bg-ivory hover:text-emerald",
        ghost: "px-3 py-2 text-emerald hover:bg-blush/60",
      },
      size: {
        default: "h-12",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-7",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
