"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import type { Hotel } from "~/lib/shared/types/hotel";
import CreateHotel from "./create";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import DeleteHotelPage from "./delete";


const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "image",
    header: "Изображение",
    cell: ({ cell }) => (
      <img
        src={(cell.getValue() as string)}
        alt="Изображение"
        className="aspect-video w-40"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: () => (
      <div className="justify-end items-center flex">
        <CreateHotel hotel={null}/>
      </div>
    ),
    cell: ({ row }) => (
      <div className="justify-end flex items-center">
        <DeleteHotelPage hotel={row.original} />
        <CreateHotel hotel={row.original}/>
        <Link href={`/admin/hotels/${row.original.id}`}>
          <Button>Подробнее</Button>
        </Link>
      </div>
    ),
  },
];

export default function HotelsTable({
  initialData,
}: {
  initialData: Hotel[];
}) {
  const { data: hotels } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const { data, error } = await api.hotels.all.get();

      if (error) throw new TreatyError(error);

      return data.hotels;
    },
    initialData,
  });

  return <DataTable columns={columns} data={hotels} />;
}
