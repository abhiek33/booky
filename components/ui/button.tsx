import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-white hover:bg-white',
        primary: 'bg-primary text-white hover:bg-primary-hover',
        accent: 'bg-accent text-white hover:bg-accent-hover',
        outline: 'border border-accent text-primary font-bold',
      },
      size: {
        sm: "h-[40px] px-3 uppercase text-[12px] tracking-[1.2px] font-bold",
        md: "h-[48px] px-6 uppercase text-[12px] tracking-[1.2px] font-bold",
        lg: "h-[60px] px-[34px] uppercase text-[12px] tracking-[2.4px] font-bold",

      },
    },
    defaultVariants: {
      variant: "accent",
      size: "sm",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
