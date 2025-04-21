"use client";

import Link from "next/link";
import { useQueryStates } from "nuqs";
import { hotelFilters } from "./query";
import { Button } from "~/components/ui/button";
import { isBefore } from "date-fns";
import { OneHotel } from "~/lib/shared/types/hotel";

export default function BookButton({
  hotelId,
  roomId,
  bookings,
}: {
  hotelId: string;
  roomId: string;
  bookings: OneHotel["rooms"][number]["bookings"];
}) {
  const [dates] = useQueryStates(hotelFilters);

  function marshalDateParams({
    startDate,
    endDate,
    guests,
  }: {
    startDate: Date;
    endDate: Date;
    guests: number;
  }) {
    const params = new URLSearchParams();
    params.append("startDate", startDate?.toISOString() ?? "");
    params.append("endDate", endDate?.toISOString() ?? "");
    params.append("guests", guests!.toString() ?? ""); 

    return params.toString();
  }

 
  const hasOverlap = bookings.some((booking) => {
    if (!dates.startDate || !dates.endDate) return false;

    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    const selectedStart = new Date(dates.startDate);
    const selectedEnd = new Date(dates.endDate);

    return (
      (selectedStart >= bookingStart && selectedStart < bookingEnd) ||
      (selectedEnd > bookingStart && selectedEnd <= bookingEnd) ||
      (selectedStart <= bookingStart && selectedEnd >= bookingEnd)
    );
  });

  if (hasOverlap) {
    return <Button disabled className="w-full bg-background text-accent border border-accent">Забронировано</Button>;
  }

  if (
    !dates.endDate ||
    !dates.startDate ||
    isBefore(dates.endDate, dates.startDate) ||
    !dates.guests
  ) {
    return <Button disabled className="w-full bg-background text-accent border border-accent">Забронировать</Button>;
  }

  return (
    <Link
      href={`${hotelId}/${roomId}?${marshalDateParams({
        startDate: dates.startDate!,
        endDate: dates.endDate,
        guests: dates.guests,
      })}`}
    >
      <Button className="w-full bg-background text-accent border border-accent">Забронировать</Button>
    </Link>
  );
}
