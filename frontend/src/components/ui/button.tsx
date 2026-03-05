import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const variantClasses = {
      default: "bg-[#D4A843] text-[#1a1a2e] hover:bg-[#c49a3a] font-semibold",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 text-slate-900",
      link: "text-[#D4A843] underline-offset-4 hover:underline",
    }

    const sizeClasses = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-10 px-8 text-base",
      icon: "h-9 w-9",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4A843] disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
