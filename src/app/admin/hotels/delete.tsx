"use client";

import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import type { Hotel } from "~/lib/shared/types/hotel";

export default function DeleteHotelPage({ hotel }: { hotel: Hotel }) {
  const deleteHotelMutation = useMutation({
    mutationKey: ["deleteHotel", hotel.id],
    mutationFn: async () => {
      const res = await api.hotels({ id: hotel.id }).delete();
      if (res.error) throw new TreatyError(res.error);
      return res.data;
    },
    onSuccess: () => {
      redirect("/admin/hotels");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="destructive">
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить отель?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Отмена</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              loading={deleteHotelMutation.isPending}
              onClick={() => deleteHotelMutation.mutate()}
            >
              Удалить
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
