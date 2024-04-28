import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [state, setState] = React.useState(false);
    return (
      <div className="flex gap-3">
        <Input type={state ? "text" : "password"} {...props} />
        <Button
          type={"button"}
          size={"icon"}
          className=" flex-shrink-0"
          onClick={() => setState(!state)}
        >
          {!state && <EyeIcon />}
          {state && <EyeOffIcon />}
        </Button>
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export { Input, InputPassword }
