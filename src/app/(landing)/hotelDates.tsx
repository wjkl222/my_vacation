"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Label } from "~/components/ui/label";

export default function HotelDates() {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const router = useRouter();

  return (
    <div className="bg-white absolute z-40 p-6 space-y-4 top-1/3 md:top-2/3 left-1/2 transform -translate-x-1/2 w-11/12 md:w-[620px] rounded-3xl">
      <div className="space-y-1">
        <Label htmlFor="terms">Заезд</Label>
        <DatePicker
          value={startDate}
          onChange={(d) => setStartDate(d ?? null)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="terms">Выезд</Label>
        <DatePicker value={endDate} onChange={(d) => setEndDate(d ?? null)} />
      </div>
      <Button
        disabled={
          !startDate || !endDate || startDate.getTime() > endDate.getTime()
        }
        className="w-full"
        onClick={() => {
          const params = new URLSearchParams();
          params.append("startDate", startDate?.toISOString() ?? "");
          params.append("endDate", endDate?.toISOString() ?? "");
          router.push(`/hotels?${params.toString()}`);
        }}
      >
        Найти номер
      </Button>
    </div>
  );
}
