"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/lib/client/api";
import { OnError } from "~/lib/client/on_error";
import { queryClient } from "~/lib/client/query-client";
import { TreatyError } from "~/lib/shared/types/error";
import { ImagesToBase64 } from "~/lib/shared/types/file";
import type { OneHotel } from "~/lib/shared/types/hotel";

const formSchema = z.object({
  image: z
    .string({
      message: "Загрузите фото",
    })
    .min(1, "Загрузите фото"),
  name: z
    .string({
      message: "Введите название",
    })
    .min(1, "Введите название"),
  pricePerNight: z.coerce
    .number({
      message: "Введите цену на ночь",
    })
    .min(1, "Введите цену на ночь"),
  size: z.coerce.number({
    message: "Введите размер комнаты",
  }),
  description: z.string(),
});

export default function CreateUpdateRoom({
  room,
  hotelId,
  onMutate,
}: {
  room?: OneHotel["rooms"][number];
  hotelId: string;
  onMutate?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: (room ?? {}) as z.infer<typeof formSchema>,
  });

  const createRoomMutation = useMutation({
    mutationKey: ["create-room"],
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["hotel", hotelId]);

      await queryClient.setQueryData(
        ["hotel", hotelId],
        async (old: OneHotel["rooms"]) =>
          ({
            ...old,
            rooms: [
              ...old,
              {
                ...data,
                id: crypto.randomUUID(),
                createdAt: new Date(),
                isDeleted: false,
              },
            ],
          }) as OneHotel["rooms"]
      );

      onMutate?.();

      return snapshot;
    },
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { data: room, error } = await api
        .hotels({ id: hotelId })
        .rooms.post({ ...data, hotelId: hotelId });
      if (error) throw new TreatyError(error);

      return room;
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["hotel", hotelId] });
    },
  });

  const updateRoomMutation = useMutation({
    mutationKey: ["update-room", room?.id ?? ""],
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { data: newRoom, error } = await api
        .hotels({ id: hotelId })
        .rooms({ roomId: room!.id })
        .put({ ...data, hotelId: hotelId });
      if (error) throw new TreatyError(error);

      return newRoom;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["hotel", hotelId]);

      await queryClient.setQueryData(
        ["hotel", hotelId],
        async (old: OneHotel["rooms"]) =>
          ({
            ...old,
            rooms: old.map((r) => {
              if (r.id === room!.id) {
                return {
                  ...r,
                  ...data,
                };
              } else {
                return r;
              }
            }),
          }) as OneHotel["rooms"]
      );

      onMutate?.();

      return snapshot;
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["hotel", hotelId] });
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (room) {
      await updateRoomMutation.mutateAsync(data);
    } else {
      await createRoomMutation.mutateAsync(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, OnError)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фото</FormLabel>
              {field.value && (
                <img
                  src={field.value}
                  alt="Фото"
                  className="object-cover size-full"
                />
              )}
              <Input
                type="file"
                multiple
                value=""
                onChange={async (e) => {
                  if (!e.target.files) return;

                  const files = Array.from(e.target.files);
                  field.onChange((await ImagesToBase64(files))[0]);
                }}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Название" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerNight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена за ночь</FormLabel>
              <FormControl>
                <Input placeholder="Цена за ночь" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Размер комнаты</FormLabel>
              <FormControl>
                <Input placeholder="Размер комнаты" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <hr />
        <Button className="w-full">Сохранить</Button>
      </form>
    </Form>
  );
}
