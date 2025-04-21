import { SearchParams } from "nuqs";
import { createSearchParamsCache } from "nuqs/server";
import { hotelFilters } from "./query";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { api } from "~/server/api";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { OneHotel  } from "~/lib/shared/types/hotel";
import BookButton from "./book-room-button";
import { auth } from "~/server/auth/auth";
import { headers } from "next/headers";
import { toast } from "sonner";
import { Reactions } from "./[roomId]/reactions";

const paramsCache = createSearchParamsCache(hotelFilters);

export default async function HotelPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
}) {

  const session = await auth.api.getSession({
            headers: await headers(),
          });
        
          if (session?.user.role !== "admin" || !session) {
            redirect("/");
          }

  const parsedParams = paramsCache.parse(await searchParams);

  if (!parsedParams.startDate || !parsedParams.endDate || !parsedParams.guests) {
    redirect("/");
  }

  const { data: hotel} = await api
    .hotels({ id: (await params).id })
    .get();

  const ratingFormatter = (rating: string) => {
    const formattedRating = rating.replace('.', ',');
    return formattedRating;
  }
  
  const colorFormatter = (rating: string) => {
    const numberRating = Number.parseFloat(rating);
    if (numberRating >= 4) {
      return "bg-[#DCFCE7] text-[#166534]"
    } else if (numberRating >= 3 || numberRating < 4) {
      return "bg-[#FEF9C3] text-[#854D0E]"
    } else {
      return "bg-[#FEE2E2] text-[#991B1B]"
    }
  }

  return (
    <div className="pt-32 container space-y-12">
      <div className="p-6 rounded-3xl bg-white flex gap-2 text-sm items-center">
        <Link href="/">
          <Button variant="link" className="p-0 size-fit text-muted">
            Главная
          </Button>
        </Link>
        <p className="text-muted-foreground">{"/"}</p>
        <p className="text-muted-foreground">Санатории</p>
        <p className="text-muted-foreground">•</p>
        <p className="text-muted-foreground">
          {format(new Date(parsedParams.startDate), "d MMM", { locale: ru })} -{" "}
          {format(new Date(parsedParams.endDate), "d MMM", { locale: ru })}
        </p>
        <p className="text-muted-foreground">{"/"}</p>
        <p className="text-accent font-medium">{hotel?.name}</p>
      </div>
      <div className="flex flex-row justify-between w-full space-x-6">
        <div className="flex flex-col w-1/2 space-y-6">
          <div className="flex flex-col w-full space-y-4">
            <div className="w-full max-h-[450px]">
              <img
              className="w-full h-full rounded-lg object-cover"
                src={hotel!.image}
                alt="hotel photo"
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h1 className="font-semibold text-2xl">{hotel!.name}</h1>
                <p className="text-base text-muted">{hotel?.country}</p>
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <Reactions hotelId={(await params).id} />
                <div className={`rounded-lg py-1 px-2 font-bold text-xl h-fit w-fit ${colorFormatter(hotel!.rating)}`}>
                  <p className="">{ratingFormatter(hotel!.rating)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-wrap gap-2">
              {hotel?.facilities.map((item) => (
                <div className="py-3 px-4 items-center justify-center bg-input rounded-xl" key={item.facilityId}>
                  <p className="text-muted text-base">{item.facility.name}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-8">
              <h1 className="font-medium text-xl">Описание</h1>
              <p>{hotel?.description}</p>
            </div>
          </div>
        </div>
        <Rooms hotel={hotel!}/>
      </div>
    </div>
  );
}

function Rooms({
  hotel,
}: {
  hotel: OneHotel;
}) {
  return (
<div className="space-y-6 w-1/2" id="rooms">
  {hotel.rooms.map((room) => (
    <div
      className="grid grid-cols-[auto_1fr] gap-4 rounded-xl bg-white w-full overflow-hidden p-4 border border-border shadow-[0_0_5px_0_rgba(0,0,0,0.1)]"
      key={room.id}
    >
      <div className="w-52 h-52 shrink-0 rounded-lg overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col min-w-0">
        <div className="flex flex-col space-y-2 min-w-0">
          <h1 className="font-medium text-xl truncate">{room.name}</h1>
          <p className="font-medium text-base text-accent">{room.size}м²</p>
          <div className="text-muted overflow-hidden">
            <p className="line-clamp-3 break-words m-0">
              {room.description}
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          <BookButton
            hotelId={hotel.id}
            roomId={room.id}
            bookings={room.bookings}
          />
        </div>
      </div>
    </div>
  ))}
</div>
  );
}