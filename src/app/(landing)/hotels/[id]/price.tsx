"use client";

import { useQueryStates } from "nuqs";
import { hotelFilters } from "./query";
import { differenceInDays } from "date-fns";

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
});

export default function Price({
  pricePerNight,
}: {
  pricePerNight: number;
}) {
  const [dates] = useQueryStates(hotelFilters);

  const days = differenceInDays(
    dates.endDate ?? new Date(),
    dates.startDate ?? new Date(),
  );

  const nights = days === 1 ? "ночь" : days > 1 && days < 5 ? "ночи" : "ночей";

  return (
    <div className="text-base font-medium text-[#0F172A]">
      <p>{numberFormatter.format(pricePerNight * days)}</p>
      <p className="font-normal">
        за {days} {nights}
      </p>
    </div>
  );
}
