"use client";

import { useState, useEffect } from "react";
import { api } from "~/lib/client/api";
import { Input } from "../ui/input";
import React from "react";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Earth, Hospital, Hotel as HotelIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { hotelFilters } from "~/app/(landing)/hotels/query";
import { previousDay } from "date-fns";

type Hotel = {
  name: string;
  country: string;
  description: string;
  rating: string;
  image: string;
  medicalBase: string;
  isFeatured: boolean;
  isDeleted: boolean;
  id: string;
  createdAt: Date;
};

type TreatmentIndication = {
  name: string;
  id: string;
  createdAt: Date;
};

type SearchResults = {
  hotels: Hotel[];
  treatmentIndications: TreatmentIndication[];
  countries: string[];
};

export default function FindHotels() {

  const [filters, setFilters] = useQueryStates(hotelFilters)

  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    hotels: [],
    treatmentIndications: [],
    countries: [],
  });
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const setStartDate = (date: Date | null) => {
    setFilters((prev) => ({...prev, startDate: date}))
  }

  const setEndDate = (date: Date | null) => {
    setFilters((prev) => ({...prev, endDate: date}))
  }

  const setGuests = (guests: number | null) => {
    setFilters((prev) => ({...prev, guests: guests}))
  }


  const [hotel, setHotel] = React.useState<string>();
  const [treatmentIndication, setTreatmentIndication] = React.useState<string>();
  const [country, setCountry] = React.useState<string>();

  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideResults();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const showResults = () => {
    setIsResultsVisible(true);
  };

  const hideResults = () => {
    setIsResultsVisible(false);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);

    if (!value) {
      hideResults();
      setSearchResults({ hotels: [], treatmentIndications: [], countries: [] });
      return;
    }

    try {
      showResults();
      const response = await api.hotels.find({ query: value }).get();
      const results = response.data;

      setSearchResults(
        results || { hotels: [], treatmentIndications: [], countries: [] }
      );
    } catch (error) {
      console.error("Ошибка при поиске: ", error);
      setSearchResults({ hotels: [], treatmentIndications: [], countries: [] });
    }
  };

  const onClick = () => {
    const params = new URLSearchParams();
    params.append("startDate", filters.startDate?.toISOString() ?? "");
    params.append("endDate", filters.endDate?.toISOString() ?? "");
    params.append("query", inputValue ?? "");
    params.append("guests", filters.guests?.toString() ?? "");
    params.append("treatmentIndications", treatmentIndication ?? "")
    params.append("country", country ?? "")
    if (hotel) {
      router.push(`/hotels/${hotel}?${params.toString()}`);
    } else {
      router.push(`/hotels?${params.toString()}`);
    }
  };

  return (
    <div className="container flex flex-row space-x-2 p-2 mt-28 shadow-[0_0_5px_0_rgba(0,0,0,0.1)] rounded-xl w-full justify-between">
      <div className="relative w-1/2">
        <Input
          type="text"
          placeholder="Курорт, санаторий, диагноз"
          className="w-full py-2 px-4 rounded-xl focus:outline-none"
          value={inputValue}
          onChange={handleInputChange}
        />
        {isResultsVisible && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md max-h-60 overflow-y-auto z-50">
            {searchResults.hotels.length > 0 ? (
              searchResults.hotels.map((item) => (
                <div
                  key={item.id}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setInputValue(item.name);
                    setHotel(item.id);
                    hideResults();
                  }}
                >
                  <div className="flex flex-row items-center space-x-2">
                    <HotelIcon className="text-red-400" /> <p>{item.name}</p>
                  </div>
                </div>
              ))
            ) : (
              null
            )}
            {searchResults.countries.length > 0 ? (
              searchResults.countries.map((item) => (
                <div
                  key={item}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setInputValue(item);
                    setCountry(item);
                    hideResults();
                  }}
                >
                  <div className="flex flex-row items-center space-x-2">
                    <Earth className="text-yellow-200" />
                    <p>{item}</p>
                  </div>
                </div>
              ))
            ) : (
              null
            )}
            {searchResults.treatmentIndications.length > 0 ? (
              searchResults.treatmentIndications.map((item) => (
                <div
                  key={item.id}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setInputValue(item.name);
                    setTreatmentIndication(item.id);
                    hideResults();
                  }}
                >
                  <div className="flex flex-row items-center space-x-2">
                    <Hospital className="text-blue-600"/><p>{item.name}</p>
                  </div>
                </div>
              ))
            ) : (
              null
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row rounded-xl items-center bg-muted-foreground w-32">
        <DatePicker
          placeholder="Заезд"
          value={filters.startDate}
          onChange={(d) => setStartDate(d ?? null)}
        />
      </div>
      <div className="flex flex-row rounded-xl items-center bg-muted-foreground w-32">
        <DatePicker
          placeholder="Выезд"
          value={filters.endDate}
          onChange={(d) => setEndDate(d ?? null)}
        />
      </div>
      <div className="w-52">
        <Select
          value={filters.guests?.toString()}
          onValueChange={(e: string) => setGuests(parseInt(e))}
        >
          <SelectTrigger className="flex w-full rounded-xl px-4">
            <SelectValue placeholder="Кол-во гостей" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <SelectItem value={(index + 1).toString()} key={index}>
                {index + 1} {index === 0 ? "Взрослый" : "Взрослых"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        disabled={!filters.startDate || !filters.endDate || !filters.guests}
        className="w-24"
        onClick={() => {
          onClick();
        }}
      >
        Найти
      </Button>
    </div>
  );
}
