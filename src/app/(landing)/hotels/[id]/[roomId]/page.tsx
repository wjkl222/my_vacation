import { CalendarDays, StarIcon } from "lucide-react";
import { SearchParams } from "nuqs";
import { createSearchParamsCache } from "nuqs/server";
import { hotelFilters } from "../query";
import { api } from "~/server/api";
import { Hotel, Room } from "~/lib/shared/types/hotel";
import OrderInformation from "./orderInfo";
import { TreatyError } from "~/lib/shared/types/error";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";
import { auth } from "~/server/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function BreadCrumbs({
  hotelName,
  startDate,
  endDate,
}: {
  hotelName: string;
  startDate: Date;
  endDate: Date;
}) {
  return (
    <div className="p-6 rounded-3xl bg-white flex gap-2 text-sm items-center">
      <Link href="/">
        <Button variant="link" className="p-0 size-fit">
          Главная
        </Button>
      </Link>
      <p className="text-muted-foreground">{">"}</p>
      <p>Отели</p>
      <p className="text-muted-foreground">•</p>
      <p className="text-muted-foreground">
        {format(new Date(startDate), "d MMM", { locale: ru })} -{" "}
        {format(new Date(endDate), "d MMM", { locale: ru })}
      </p>
      <p className="text-muted-foreground">{">"}</p>
      <p>{hotelName}</p>
      <p className="text-black">Бронирование</p>
    </div>
  );
}

function BookInformation({
  hotel,
  room,
  startDate,
  endDate,
}: {
  hotel: Omit<
    Hotel,
    "rooms" | "facilities" | "treatmentIndications" | "medicalBase"
  >;
  room: Room;
  startDate: Date;
  endDate: Date;
  guests: number;
}) {
  return (
    <div className="md:container mx-4 md:mx-auto flex flex-row rounded-3xl font-inter bg-white my-6 space-x-6">
      <div className="rounded-t-3xl md:rounded-t-none md:rounded-l-3xl md:w-64 w-full">
        <Image
          src={hotel.image}
          alt="hotel image"
          width={100}
          height={100}
          className="size-full rounded-lg"
        />
      </div>
      <div className="flex flex-row justify-between w-full min-w-0 space-x-4">
        <div className="flex flex-col space-y-6 flex-1 min-w-0">
          <div className="flex flex-col space-y-2">
            <h1 className="font-medium text-xl">{hotel.name}</h1>
            <p className="text-muted">{hotel.country}</p>
          </div>
          <div className="flex flex-col space-y-2 min-w-0">
            <p className="line-clamp-2 break-words m-0 overflow-hidden text-ellipsis text-muted">
              {room.description}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-base font-medium">{room.name}</p>
            <p className="text-accent font-medium text-base">{room.size}m</p>
          </div>
        </div>
        <div className="flex flex-col my-3 py-0 :p-6 font-medium text-base space-y-6 text-[#0F172A] text-opacity-40 justify-center">
          <div className="flex flex-col space-y-2">
            <p>Заезд с 12:00</p>
            <div className="flex flex-row space-x-2">
              <CalendarDays />
              <p>{format(new Date(startDate), "d/M/y")}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <p>Выезд до 12:00</p>
            <div className="flex flex-row space-x-2">
              <CalendarDays />
              <p>{format(new Date(endDate), "d/M/y")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const paramsCache = createSearchParamsCache(hotelFilters);

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{
    roomId: string;
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
  const { data: room, error } = await api.hotels
    .room({ roomId: (await params).roomId })
    .get();

  if (error) throw new TreatyError(error);

  return (
    <div>
      <BreadCrumbs
        startDate={parsedParams.startDate!}
        endDate={parsedParams.endDate!}
        hotelName={room!.hotel.name!}
      />
      <BookInformation
        hotel={room!.hotel}
        room={room!}
        startDate={parsedParams.startDate!}
        endDate={parsedParams.endDate!}
        guests={parsedParams.guests!}
      />
      <OrderInformation room={room!} params={parsedParams} name={session.user.name} email={session.user.email} />
    </div>
  );
}
