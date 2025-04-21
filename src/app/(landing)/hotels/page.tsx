import { createSearchParamsCache, type SearchParams } from "nuqs/server";
import { hotelFilters } from "./query";
import { api } from "~/server/api";
import { redirect } from "next/navigation";
import { TreatyError } from "~/lib/shared/types/error";
import HotelFilters from "./filters";
import Hotels from "./hotels";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const paramsCache = createSearchParamsCache(hotelFilters);

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const parsedParams = paramsCache.parse(await searchParams);

  if (!parsedParams.startDate || !parsedParams.endDate) {
    redirect("/");
  }

  const { data: filterValues, error: filterValuesError } =
    await api.hotels.filterValues.get();
  if (filterValuesError) throw new TreatyError(filterValuesError);

  const { data: hotels, error } = await api.hotels.index.get({
    query: {
      dates: {
        startDate: parsedParams.startDate,
        endDate: parsedParams.endDate,
      },
      filters: {
        rating: parsedParams.rating ?? undefined,
        country: parsedParams.country ?? undefined,
        facilities: parsedParams.facilities ?? undefined,
        medicalBase: parsedParams.medicalBase ?? undefined,
        price: parsedParams.price ?? undefined,
        treatmentIndications: parsedParams.treatmentIndications ?? undefined,
      },
    },
  });

  if (error) throw new TreatyError(error);

  return (
    <div className="pt-32 container space-y-12">
      <div className="p-6 rounded-3xl bg-white flex gap-2 text-sm items-center">
        <Link href="/">
          <Button variant="link" className="p-0 size-fit text-muted">
            Главная
          </Button>
        </Link>
        <p className="text-muted-foreground">{"/"}</p>
        <p className="text-accent font-medium">Санатории</p>
        <p className="text-muted-foreground">•</p>
        <p className="text-muted-foreground">
          {format(new Date(parsedParams.startDate), "d MMM", { locale: ru })} -{" "}
          {format(new Date(parsedParams.endDate), "d MMM", { locale: ru })}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <HotelFilters filterValues={filterValues}/>
        <Hotels initialData={hotels.hotels} />
      </div>
    </div>
  );
}
