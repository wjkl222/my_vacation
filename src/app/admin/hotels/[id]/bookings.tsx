"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import type { Booking } from "~/lib/shared/types/hotel";

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "startDate",
    header: "Дата заезда",
    cell: ({ cell }) => format(cell.getValue() as Date, "dd.MM.yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "Дата выезда",
    cell: ({ cell }) => format(cell.getValue() as Date, "dd.MM.yyyy"),
  },
  {
    accessorKey: "guests",
    header: "Количество гостей",
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Номер телефона",
  },
  {
    accessorKey: "additionalInfo",
    header: "Дополнительная информация",
  },
  {
    accessorKey: "price",
    header: "Сумма",
  },
  {
    accessorKey: "isActive",
    header: "Статус",
    cell: ({row}) => {
      return <ActivateButton id={row.original.id} status={row.original.isActive}/>
    }
  }
];

function ActivateButton({id, status}: {id: string, status: boolean}) {

  const router = useRouter();

  const activateMutation = useMutation({
    mutationKey: ["activate"],
    mutationFn: async () => {
      await api.bookings.activate({bookingId: id}).put()
    },
    onSuccess: () => {
      router.refresh()
    }
  })

  return <Button disabled={status} 
  onClick={() => activateMutation.mutate()} 
  className={`bg-background ${status ? "text-lime-600" : "text-muted-foreground"}`}>{status ? "Подтверждено" : "В обработке"}
</Button>
}

export default function BookingsDialog({
  hotelId,
  roomId,
}: {
  hotelId: string;
  roomId: string;
}) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["hotel", hotelId, "room", roomId, "bookings"],
    queryFn: async () => {
      const { data, error } = await api.bookings.room({roomId: roomId}).get()
      if (error) throw new TreatyError(error);

      return data;
    },
  });

  if (!bookings || isLoading) {
    return <Button loading>Подробнее</Button>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Подробнее</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] md:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Подробнее</DialogTitle>
        </DialogHeader>
        <DataTable columns={columns} data={bookings.bookings} />
      </DialogContent>
    </Dialog>
  );
}
