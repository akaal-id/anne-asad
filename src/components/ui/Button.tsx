import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-sans tracking-wide uppercase text-sm",
          {
            "bg-navy-primary text-white hover:bg-navy-primary/90 shadow-sm": variant === "primary",
            "border border-navy-primary bg-transparent hover:bg-navy-primary hover:text-white text-navy-primary": variant === "outline",
            "hover:bg-slate-100 hover:text-navy-primary text-navy-deep": variant === "ghost",
            "h-9 px-4 py-2": size === "sm",
            "h-11 px-8 py-3": size === "md",
            "h-14 px-10 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
