import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/themeStore"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-primary hover:brightness-110 text-white shadow-sm",
        secondary:
          "bg-bg-tertiary hover:bg-bg-secondary text-text-primary",
        ghost: "hover:bg-bg-tertiary text-text-primary",
        danger:
          "bg-accent-error hover:brightness-110 text-white shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, children, disabled, ...props }, ref) => {
    const { glassEffectEnabled, theme } = useThemeStore()
    const Comp = asChild ? Slot : "button"
    
    const glassClasses = glassEffectEnabled && theme.glass.enabled
      ? "backdrop-blur-glass bg-opacity-glass"
      : ""
    
    const content = (
      <>
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : icon}
        {children}
      </>
    )
    
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), glassClasses, className)}
          ref={ref}
          {...props}
        >
          {content}
        </Comp>
      )
    }
    
    return (
      <motion.button
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(buttonVariants({ variant, size }), glassClasses, className)}
        ref={ref}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {content}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
