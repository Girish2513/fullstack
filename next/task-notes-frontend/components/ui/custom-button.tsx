"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const customButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all",
  {
    variants: {
      intent: {
        success: "bg-green-600 hover:bg-green-700 text-white",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
      },
      glow: {
        true: "shadow-lg hover:shadow-xl",
        false: "",
      },
    },
    defaultVariants: {
      glow: false,
    },
  }
);

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {}

export function CustomButton({
  className,
  intent,
  glow,
  ...props
}: CustomButtonProps) {
  return (
    <button
      className={cn(customButtonVariants({ intent, glow }), className)}
      {...props}
    />
  );
}

export { customButtonVariants };
