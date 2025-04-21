"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { OneHotel, Room } from "~/lib/shared/types/hotel";
import CreateUpdateRoom from "./create-update-room";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TreatyError } from "~/lib/shared/types/error";
import { api } from "~/lib/client/api";
import { DataTable } from "~/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import BookingsDialog from "./bookings";
import { toast } from "sonner";
import { queryClient } from "~/lib/client/query-client";

function DeleteRoom ({id, hotelId}: {id: string, hotelId: string}) {
  const deleteMutation = useMutation({
    mutationKey: ["deleteRoom"],
    mutationFn: async ({id, hotelId} : {id: string, hotelId: string}) => {
      api.hotels({id: hotelId}).rooms({roomId: id}).delete();
    }, 
    onSuccess: () => {
      toast.success("Удаление прошло успешно")
      queryClient.refetchQueries({
        queryKey: ["rooms"]
      })
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    }
  })
  return <Button onClick={() => deleteMutation.mutate({id: id, hotelId: hotelId})}><Trash2/></Button>
}

const columns: ColumnDef<OneHotel["rooms"][number]>[] = [
  {
    accessorKey: "image",
    header: "Изображение",
    cell: ({ cell }) => (
      <img
        src={cell.getValue() as string}
        alt="Изображение"
        className="aspect-video w-24"
      />
    ),
  },

  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "size",
    header: "Размер",
  },
  {
    accessorKey: "pricePerNight",
    header: "Цена за ночь"
  },
  {
    accessorKey: "bookings",
    header: "Статус",
    cell: ({ row }) => {
      const isBooked = row.original.bookings.some((b) => {
        return (
          b.startDate.getTime() <= Date.now() &&
          b.endDate.getTime() >= Date.now()
        );
      });

      return isBooked ? (
        <span className="text-red-500">Забронирован</span>
      ) : (
        <span className="text-green-500">Свободно</span>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      const params: { id: string } = useParams();
      return (
        <div className="justify-end items-center flex">
          <CreateRoom hotelId={params.id} />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="justify-end flex items-center">
        <CreateRoom hotelId={row.original.hotelId} room={row.original}/>
        <DeleteRoom id={row.original.id} hotelId={row.original.hotelId} />
        <BookingsDialog
          roomId={row.original.id}
          hotelId={row.original.hotelId}
        />
      </div>
    ),
  },
];

export default function RoomsTable({
  initialData,
  hotelId,
}: {
  initialData: Room[];
  hotelId: string,
}) {
  const { data: rooms } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      const { data, error } = await api
          .hotels.roomsByHotelId({id: hotelId}).get();
      if (error) throw new TreatyError(error);
      return data.rooms;
    },
    initialData,
  });

  return <DataTable columns={columns} data={rooms} />;
}

function CreateRoom({
  hotelId,
  room,
}: {
  hotelId: string
  room?: OneHotel["rooms"][number]
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          {room ? <Pencil/> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "Изменить комнату" : "Создать комнату"}</DialogTitle>
        </DialogHeader>
        <CreateUpdateRoom onMutate={() => setOpen(false)} hotelId={hotelId} room={room}/>
      </DialogContent>
    </Dialog>
  );
}
