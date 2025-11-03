import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gpu-accelerated',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl dark:shadow-luxury-md dark:hover:shadow-luxury-lg',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:border-primary shadow-xl dark:bg-background dark:text-foreground dark:border-primary/60 dark:hover:bg-primary dark:hover:text-white font-bold tracking-wide',
        secondary:
          'bg-secondary text-white hover:bg-secondary/90 shadow-lg dark:shadow-md',
        ghost: 'text-primary dark:text-foreground hover:bg-primary hover:text-white dark:hover:bg-primary/10 dark:hover:text-primary font-bold border-2 border-primary/30 hover:border-primary dark:border-transparent dark:hover:border-primary/20 shadow-sm hover:shadow-md',
        link: 'text-primary underline-offset-4 hover:underline font-bold',
        luxury: 'bg-luxury-gradient text-white hover:shadow-luxury-glow border-2 border-primary/50 shadow-2xl font-bold tracking-wide',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

