"use client";

import { useQueryStates, Values } from "nuqs";
import { hotelFilters } from "./query";
import type { FilterValues } from "~/lib/shared/types/hotel";
import { Checkbox } from "~/components/ui/checkbox";
import { useEffect, useState } from "react";
import { cn } from "~/lib/client/utils";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

export default function HotelFilters({
  filterValues,
}: {
  filterValues: FilterValues;
}) {
  const [filters, setFilters] = useQueryStates(hotelFilters);

  const [localFilters, setLocalFilters] = useState(filters);


  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const applyFilters = () => {
    setFilters(localFilters);
  };

  type HotelFilters = Values<typeof hotelFilters>;

  const resetFilters = () => {
    const resetValues: HotelFilters = {
      country: [],
      facilities: [],
      medicalBase: null,
      treatmentIndications: [],
      rating: null,
      startDate: filters.startDate,
      price: null,
      guests: filters.guests,
      endDate: filters.endDate,
      sortPopularityUp: false,
    };

    setLocalFilters(resetValues);
    setFilters(resetValues);
  };

  return (
    <aside className="lg:max-w-96 lg:shrink-0 lg:grow rounded-3base bg-white p-6 overflow-hidden">
      <div className="flex flex-col transition-all lg:transition-none space-y-6">
        <Button className="flex justify-between w-full h-12 bg-[#F5F5F5] text-[#1F1F1F] text-base font-normal px-3" onClick={() => setLocalFilters((prev) => ({
              ...prev,
              sortPopularityUp: !localFilters.sortPopularityUp
            }))}>
          <p>Популярность</p>
          {localFilters.sortPopularityUp ? <ArrowUpWideNarrow/> :<ArrowDownWideNarrow/>}
        </Button>
        <Select
          value={localFilters.price !== null ? String(localFilters.price) : ""}
          onValueChange={(value) => {
            setLocalFilters((prev) => ({
              ...prev,
              price: value ? value : null,
            }));
          }}
        >
          <SelectTrigger className="w-full h-12 bg-[#F5F5F5] rounded-xl">
            <SelectValue placeholder="Цена"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">до 2000</SelectItem>
            <SelectItem value="5000">до 5 000</SelectItem>
            <SelectItem value="10000">до 10 000</SelectItem>
          </SelectContent>
        </Select>
        <div className={cn("flex flex-col gap-4 border-b border-border pb-6")}>
          <p className="font-semibold text-base">Страны</p>
          {filterValues.countries.map((country) => (
            <label key={country} className="flex items-center gap-2">
              <Checkbox
                checked={localFilters.country?.includes(country)}
                onCheckedChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    country: e
                      ? [...(prev.country || []), country]
                      : prev.country?.filter((c) => c !== country) || [],
                  }));
                }}
              />
              <p className="text-base">{country}</p>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-b border-border pb-6 pt-2">
          <p className="font-semibold text-base">Удобства</p>
          {filterValues.facilities.map((facility) => (
            <label key={facility.id} className="flex items-center gap-2">
              <Checkbox
                checked={localFilters.facilities?.includes(facility.id)}
                onCheckedChange={(e) => {
                  if (e) {
                    setLocalFilters({
                      ...localFilters,
                      facilities: [
                        ...(localFilters.facilities || []),
                        facility.id,
                      ],
                    });
                  } else {
                    setLocalFilters({
                      ...localFilters,
                      facilities:
                        localFilters.facilities?.filter(
                          (id) => id !== facility.id
                        ) || [],
                    });
                  }
                }}
              />
              <p className="text-base">{facility.name}</p>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-b border-border pb-6 pt-2">
          <p className="font-semibold text-base">Лечебная база</p>
          {filterValues.medicalBases.map((medicalBase) => (
            <label key={medicalBase.id} className="flex items-center gap-2">
              <Checkbox
                checked={localFilters.medicalBase === medicalBase.id}
                onCheckedChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    medicalBase: e ? medicalBase.id : null,
                  }));
                }}
              />
              <p className="text-base">{medicalBase.name}</p>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-b border-border pb-6 pt-2">
          <p className="font-semibold text-base">Показания к лечению</p>
          {filterValues.treatmentIndications.map((indication) => (
            <label key={indication.id} className="flex items-center gap-2">
              <Checkbox
                checked={localFilters.treatmentIndications?.includes(
                  indication.id
                )}
                onCheckedChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    treatmentIndications: e
                      ? [...(prev.treatmentIndications || []), indication.id]
                      : prev.treatmentIndications?.filter(
                          (id) => id !== indication.id
                        ) || [],
                  }));
                }}
              />
              <p className="text-base">{indication.name}</p>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-6">
          <Button
            onClick={applyFilters}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Применить
          </Button>
          <Button onClick={resetFilters} variant="outline" className="w-full">
            Очистить фильтры
          </Button>
        </div>
      </div>
    </aside>
  );
}
