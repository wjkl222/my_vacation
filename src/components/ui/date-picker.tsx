"use client";

import { format } from "date-fns";
import { CalendarDays as CalendarIcon } from "lucide-react";

import { ru } from "date-fns/locale";
import { forwardRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/client/utils";

export const DatePicker = forwardRef<
  HTMLDivElement,
  {
    value?: Date | null;
    onChange: (val?: Date | null) => void;
    disabledAfter?: Date;
    children?: React.ReactNode;
    side?: "top" | "bottom";
    sideOffset?: number;
    placeholder?: string;
  }
>(function DatePickerCmp(
  {
    children,
    sideOffset,
    disabledAfter,
    placeholder,
    side,
    value: date,
    onChange: setDate,
  },
  ref,
) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild className="items-center flex justify-center">
        {children ? (
          children
        ) : (
          <Button
            variant="input"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="h-4 w-4" />
            {date ? (
              <span>{format(date, "dd.MM.yyyy", {
                locale: ru,
              })}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        sideOffset={sideOffset}
        side={side}
        className="w-auto p-0"
        ref={ref}
      >
        <Calendar
          locale={ru}
          mode="single"
          fixedWeeks
          selected={date ?? undefined}
          onSelect={(d) => setDate(d)}
          initialFocus
          disabled={
            disabledAfter
              ? {
                  after: disabledAfter,
                }
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  );
});
