import FindHotels from "~/components/custome/findHotels";
import Sity from "../../../public/sity.svg";
import Calendar from "../../../public/Calendar.svg";
import Clock from "../../../public/clock.svg";
import Image from "next/image";
import { api } from "~/server/api";
import { TreatyError } from "~/lib/shared/types/error";
import { createSearchParamsCache } from "nuqs/server";
import { hotelFilters } from "./hotels/query";
import Best from "./bestHotels";

export default async function Page() {
  const { data: hotels, error } = await api.hotels.featured.get();
  if (error) throw new TreatyError(error);
  return (
    <div className="flex flex-col container mx-auto space-y-12">
      <FindHotels />
      <Advantages />
      <Best hotels={hotels.hotels}/>
    </div>
  );
}

function Advantages() {
  return (
    <div className="flex flex-col py-16 space-y-12">
      <div className="flex flex-row items-center justify-center text-foreground text-4xl space-x-2 font-semibold">
        <h1>Ваш</h1>
        <h1 className="text-yellow-300">отдых</h1>
        <h1>начинается здесь</h1>
      </div>
      <div className="flex flex-row space-x-16 justify-center text-muted text-base text-center">
        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="w-40 h-40">
            <Image src={Sity} alt="sity image" />
          </div>
          <span>
            Выбирайте свой идеальный
            <br /> санаторий из сотен проверенных
            <br /> вариантов по всей стране
          </span>
        </div>
        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="w-40 h-40">
            <Image src={Calendar} alt="calendar image" />
          </div>
          <span>
            Укажите даты поездки в пару
            <br /> кликов и найдите свободные
            <br /> номера мгновенно
          </span>
        </div>
        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="w-40 h-40">
            <Image src={Clock} alt="clock image" />
          </div>
          <span>
            Бронируйте онлайн за минуту —<br /> просто, удобно и без лишних
            <br /> звонков или ожидания
          </span>
        </div>
      </div>
    </div>
  );
}