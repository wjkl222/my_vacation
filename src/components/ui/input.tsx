import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "~/lib/client/utils";
import { Button } from "./button";

export interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 focus:outline-none w-full rounded-md border border-input bg-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent focus:ring-input file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="h-fit relative flex items-center">
        <Input
          autoComplete="current-password"
          type={visible ? "text" : "password"}
          className="pr-12"
          ref={ref}
          {...props}
        />
        <Button
          tabIndex={-1}
          size="icon"
          type="button"
          variant="transparent"
          onClick={() => setVisible(!visible)}
          className="absolute right-0 inset-y-0 text-muted-foreground"
        >
          {visible ? (
            <EyeOffIcon className="size-8" />
          ) : (
            <EyeIcon className="size-8" />
          )}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
