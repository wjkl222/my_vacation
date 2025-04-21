"use client";

import { useQueryStates } from "nuqs";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { hotelFilters } from "./query";
import { addDays, setDate } from "date-fns";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect } from "react";
import Link from "next/link";

export default function Booking({
  hotelName,
}: {
  hotelName: string;
}) {
  const [dates, setDates] = useQueryStates(hotelFilters);

  useEffect(() => {
    if (!dates.endDate) {
      setDates({ endDate: addDays(new Date(), 1) });
    }
    if (!dates.startDate) {
      setDates({ startDate: new Date() });
    }
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 flex flex-col space-y-4 w-full">
      <p className="text-xl font-medium">{hotelName}</p>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="grow shrink grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DatePicker
            value={dates.startDate ?? new Date()}
            onChange={(e) => setDates({ startDate: e })}
          />
          <DatePicker
            value={dates.endDate ?? addDays(new Date(), 1)}
            onChange={(e) => setDates({ endDate: e })}
          />
          <Select
            value={dates.guests?.toString()}
            onValueChange={(e) => setDates({ guests: e ? parseInt(e) : null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Кол-во гостей" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <SelectItem value={(index + 1).toString()} key={index}>
                  {index + 1} {index === 0 ? "Взрослый" : "Взрослых"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href="#rooms">
          <Button className="w-full lg:w-auto">Выбрать номер</Button>
        </Link>
      </div>
    </div>
  );
}
