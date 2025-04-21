"use client";

import { WalletCards } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import { Hotel } from "~/lib/shared/types/hotel";
import { toast } from "sonner";

type SimpleHotel = Omit<Hotel, "facilities" | "treatmentIndications" | "medicalBase"> & {
  minPrice: number
}

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
  params.append("guests", guests?.toString() ?? "");

  return params.toString();
}

export default function Best({hotels}: {hotels: SimpleHotel[]}) {

    const searchParams = useSearchParams();

    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!) : undefined;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, hotelId: string) => {
      if (!startDate || !endDate || !guests) {
        e.preventDefault();
        toast.error("Пожалуйста, введите дату заезда, дату выезда и колличество гостей")
      }
    };

  return (
    <Carousel className="container pt-12">
      <div className="flex flex-col space-y-6 p-6 bg-white rounded-3xl">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="font-semibold text-2xl flex flex-row gap-1">
            <span className="text-accent">Лучшие</span>
            <span>по оценкам</span>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent>
          {hotels.map((hotel) => (
            <CarouselItem
              key={hotel.id}
              className="basis-1/5"
            >
              <Link
                href={`/hotels/${hotel.id}?${marshalDateParams({
                  startDate: startDate!,
                  endDate: endDate!,
                  guests: guests!
                })}`}
                className="flex flex-col space-y-2"
                onClick={(e) => handleClick(e, hotel.id)}
              >
                <div className="w-full aspect-square overflow-hidden rounded-xl">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2 text-sm">
                  <p className="text-base font-medium">{hotel.name}</p>
                  <div className="flex flex-row space-x-1 items-center">
                    <WalletCards className="text-accent size-4 text-opacity-40"/>
                    <p className="text-accent font-medium text-sm">Цена от {hotel.minPrice}₽</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}