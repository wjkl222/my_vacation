"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import type { Hotel } from "~/lib/shared/types/hotel";
import { hotelFilters } from "./query";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";


function marshalDateParams({
  startDate,
  endDate,
  guests,
}: {
  startDate: Date;
  endDate: Date;
  guests: number
}) {
  const params = new URLSearchParams();
  params.append("startDate", startDate?.toISOString() ?? "");
  params.append("endDate", endDate?.toISOString() ?? "");
  params.append("guests", guests.toString())

  return params.toString();
}

const ratingFormatter = (rating: string) => {
  const formattedRating = rating.replace('.', ',');
  return formattedRating;
}

const colorFormatter = (rating: string) => {
  const numberRating = Number.parseFloat(rating);
  if (numberRating >= 4) {
    return "bg-[#DCFCE7] text-[#166534]"
  } else if (numberRating >= 3 && numberRating < 4) {
    return "bg-[#FEF9C3] text-[#854D0E]"
  } else if (numberRating < 3){
    return "bg-[#FEE2E2] text-[#991B1B]"
  }
}

export default function Hotels({ initialData }: { initialData: Hotel[] }) {
  const [filters, setFilters] = useQueryStates(hotelFilters);

  const { data: hotels, refetch } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const res = await api.hotels.index.get({
        query: {
          dates: {
            startDate: filters.startDate!,
            endDate: filters.endDate!,
          },
          filters: {
            rating: filters.rating ?? undefined,
            country: filters.country ?? undefined,
            facilities: filters.facilities ?? undefined,
            medicalBase: filters.medicalBase ?? undefined,
            price: filters.price ?? undefined,
            treatmentIndications: filters.treatmentIndications ?? undefined,
            sortPopularityUp: filters.sortPopularityUp ?? false
          },
        },
      });

      if (res.error) throw new TreatyError(res.error);

      return res.data.hotels;
    },
    initialData,
  });

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <div className="grow space-y-6">
      <div className="flex flex-col gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="flex flex-row rounded-xl border border-[#F5F5F5] space-x-2 p-2 shadow-sm">
            <div className="size-52 flex flex-row space-y-2 rounded-xl aspect-square">
              <Image
                src={hotel.image}
                alt="hotel photo"
                className="w-full h-full rounded-xl"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col w-full justify-between">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-xl text-foreground">{hotel.name}</h1>
                    <p className="text-base text-muted">{hotel.country}</p>
                  </div>
                  <div className={`rounded-lg py-1 px-2 font-bold text-xl h-fit w-fit ${colorFormatter(hotel.rating)}`}>
                    <p className="">{ratingFormatter(hotel.rating)}</p>
                  </div>
                </div>
                <p className="text-accent font-medium text-base">{`Цена от ${hotel.rooms[0]?.pricePerNight}₽`}</p>
                <span className="text-muted">{hotel.description}</span>
              </div>
              <Link
                href={`/hotels/${hotel.id}?${marshalDateParams({
                  startDate: filters.startDate!,
                  endDate: filters.endDate!,
                  guests: filters.guests!
                })}`}
                className="w-full"
              >
                <Button className="bg-white text-accent border-accent border">Забронировать</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
