import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-[#D4A843] text-[#1a1a2e] hover:bg-[#c49a3a]",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-slate-200 text-slate-900",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
