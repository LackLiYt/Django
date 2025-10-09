import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const inputGroupVariants = cva(
  "flex items-center w-full border border-input bg-background rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const inputGroupAddonVariants = cva(
  "flex items-center justify-center border-r border-input bg-muted text-muted-foreground",
  {
    variants: {
      align: {
        "inline-start": "border-r",
        "inline-end": "border-l border-r-0",
      },
      size: {
        default: "px-3",
        sm: "px-2",
        lg: "px-4",
      },
    },
    defaultVariants: {
      align: "inline-start",
      size: "default",
    },
  }
)

const inputGroupInputVariants = cva(
  "flex-1 border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "px-3 py-2",
        sm: "px-2 py-1.5",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const inputGroupButtonVariants = cva(
  "border-0 bg-transparent hover:bg-muted focus-visible:outline-none",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(inputGroupVariants({ size, className }))}
        {...props}
      />
    )
  }
)
InputGroup.displayName = "InputGroup"

interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupAddonVariants> {}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(inputGroupAddonVariants({ align, size, className }))}
        {...props}
      />
    )
  }
)
InputGroupAddon.displayName = "InputGroupAddon"

interface InputGroupInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputGroupInputVariants> {}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(inputGroupInputVariants({ size, className }))}
        {...props}
      />
    )
  }
)
InputGroupInput.displayName = "InputGroupInput"

interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof inputGroupButtonVariants> {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
}

const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, size, variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        className={cn(inputGroupButtonVariants({ size, className }))}
        {...props}
      />
    )
  }
)
InputGroupButton.displayName = "InputGroupButton"

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  inputGroupVariants,
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupButtonVariants,
}
