"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/client/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import type { Room } from "~/lib/shared/types/hotel";

export default function OrderInformation({
  room,
  params,
  name,
  email
}: {
  room: Room;
  name: string;
  email: string;
  params: {
    startDate: Date | null;
    endDate: Date | null;
    guests: number | null;
  };
}) {
  const router = useRouter();

  const BookingSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    guests: z.number(),
    additionalInfo: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      startDate: params.startDate,
      endDate: params.endDate,
      guests: params.guests,
      email: email,
      name: name
    } as z.infer<typeof BookingSchema>,
  });

  const createPaymentMutation = useMutation({
    mutationKey: ["createBooking"],
    mutationFn: async ({
      data,
    }: {
      data: z.infer<typeof BookingSchema>;
    }) => {
      
      try {
      await api.bookings.index.post({...data, hotelId: room.hotelId, roomId: room.id, price: totalPrice})
      } catch (error) {
        return error
      }
      await api.email.send.booking({email: data.email}).post({...data, price: totalPrice, hotelId: room.hotelId, roomName: room.name})

    },
    onSuccess: async () => {
      router.push("/profile?newBooking=true")
      form.reset();

    },
    onError: () => {
      toast.error("Ошибка. Повторите попытку");
    },
  });

  const onSubmit = async (data: z.infer<typeof BookingSchema>) => {
    await createPaymentMutation.mutateAsync({
      data: {
        ...data,
        guests: params.guests!,
        startDate: params.startDate!,
        endDate: params.endDate!,
      },
    });
  };

  const totalPrice = ((params.endDate!.getTime() - params.startDate!.getTime()) / (1000 * 60 * 60 * 24)) * room.pricePerNight

  return (
    <div className="md:container mx-4 md:mx-auto flex flex-col md:items-start items-center md:flex-row font-inter space-y-6 md:space-y-0">
      <div className="w-full md:w-2/3 flex flex-col space-y-4 bg-white rounded-3xl p-6">
        <Form {...form}>
          <form id="booking-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full" placeholder="Почта" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full" placeholder="ФИО" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Телефон"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="w-full resize-none" placeholder="Ваши пожелания" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="font-inter flex flex-col w-full md:w-1/3 md:ml-6 p-6 space-y-4 bg-white rounded-3xl h-fit">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="font-medium text-xl">Стоимость</h1>
            <p className="text-[#0F172A66] text-base">
              {params.guests} взрослый, 2 ночи
            </p>
          </div>
          <p className="text-base text-[#0F172A]">
            {(params.endDate!.getTime() - params.startDate!.getTime()) /
              (1000 * 60 * 60 * 24)}{" "}
            x {room.pricePerNight} ₽
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-[#2A344D] text-base font-medium">
            Итоговая сумма:
          </p>
          <p className="text-[#2A344D] text-base font-medium">
            {totalPrice}{" "}
            ₽
          </p>
        </div>
        <Button
          className="w-full"
          loading={createPaymentMutation.isPending}
          type="submit"
          form="booking-form"
        >
          Забронировать
        </Button>
      </div>
    </div>
  );
}

