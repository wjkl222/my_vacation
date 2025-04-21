"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/lib/client/api";
import { OnError } from "~/lib/client/on_error";
import { queryClient } from "~/lib/client/query-client";
import { TreatyError } from "~/lib/shared/types/error";
import { ImagesToBase64 } from "~/lib/shared/types/file";
import type { Hotel } from "~/lib/shared/types/hotel";
import { Facility } from "~/lib/shared/types/facilities";
import { TreatmentIndication } from "~/lib/shared/types/treatmentIndications";
import { MedicalBase } from "~/lib/shared/types/medicalBase";
import { Checkbox } from "~/components/ui/checkbox";

export const hotelSchema = z.object({
  name: z
    .string({
      message: "Введите название",
    })
    .min(1, "Введите название")
    .max(255, "Название слишком длинное"),
  description: z
    .string({
      message: "Введите описание",
    })
    .min(1, "Введите описание"),
  rating: z.coerce
    .string({
      message: "Введите рейтинг",
    })
    .refine((val) => {
      const decimalPart = val.toString().split(".")[1];
      return !decimalPart || decimalPart.length <= 1;
    }, "Рейтинг должен иметь максимум 1 знак после запятой")
    .refine((val) => {
      const intVal = parseFloat(val);
      return (1 <= intVal && intVal <= 5);
    }, "Рейтинг должен быть меньше 5 и больше 1"),
  country: z
    .string({
      message: "Введите страну",
    })
    .min(1, "Введите страну")
    .max(255, "Название страны слишком длинное"),
  medicalBase: z
    .string({
      message: "Выберите медицинскую базу",
    })
    .min(1, "Выберите медицинскую базу"),
  image: z
    .string({
      message: "Загрузите изображение",
    })
    .min(1, "Загрузите изображение"),
  isFeatured: z.boolean().default(false),
  facilities: z.array(z.string()).min(1, "Выберите хотя бы одно удобство"),
  treatmentIndications: z
    .array(z.string())
    .min(1, "Выберите хотя бы одно показание для лечения"),
});

export default function CreateUpdateHotelForm({
  hotel,
  onMutate,
}: {
  hotel?: Hotel;
  onMutate?: () => void;
}) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [treatmentIndications, setTreatmentIndicatioons] = useState<
    TreatmentIndication[]
  >([]);
  const [medicalBases, setMedicalBases] = useState<MedicalBase[]>([]);

  useEffect(() => {
    const getData = async () => {
      const fas = await api.facilities.index.get();
      setFacilities(fas.data!.facilities);

      const trea = await api.treatmentIndications.index.get();
      setTreatmentIndicatioons(trea.data!.treatmentIndications);

      const mb = await api.medicalBase.index.get();
      setMedicalBases(mb.data!.medicalBase);
    };

    getData();
  }, []);

  const form = useForm({
    resolver: zodResolver(hotelSchema),
    defaultValues: (hotel ? {
      ...hotel, 
      facilities: hotel.facilities.map(item => item.id), 
      treatmentIndications: hotel.treatmentIndications.map(item => item.id), 
      medicalBase: hotel.medicalBase.id
    } : {}) as z.infer<typeof hotelSchema>,
  });

  const createHotelMutation = useMutation({
    mutationKey: ["create-hotel"],
    mutationFn: async (data: z.infer<typeof hotelSchema>) => {
      const { data: hotel, error } = await api.hotels.index.post(data);

      if (error) throw new TreatyError(error);

      return hotel;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["hotels"]);

      await queryClient.setQueryData(
        ["hotels"],
        async (old: Hotel[]) =>
          [
            ...old,
            {
              id: crypto.randomUUID(),
              ...data,
            },
          ] as Hotel[]
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Санаторий успешно создан");
      form.reset();
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["hotels"] });
    },
  });

  const updateHotelMutation = useMutation({
    mutationKey: ["update-hotel", hotel?.id ?? ""],
    mutationFn: async (data: z.infer<typeof hotelSchema>) => {
      const { data: hotels, error } = await api
        .hotels({ id: hotel!.id })
        .put(data);
      if (error) throw new TreatyError(error);
      return hotels;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["hotel", hotel!.id]);

      await queryClient.setQueryData(
        ["hotel", hotel!.id],
        async (old: Hotel) => ({
          ...old,
          ...data,
        })
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Санаторий успешно обновлен");
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["hotels"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof hotelSchema>) => {
    if (hotel) {
      await updateHotelMutation.mutateAsync(data);
    } else {
      await createHotelMutation.mutateAsync(data);
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
              <div className="grid grid-cols-4 gap-2">
                {field.value && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={field.value}
                      alt="Фото"
                      className="object-cover size-full"
                    />
                  </div>
                )}
              </div>
              <Input
                type="file"
                multiple
                value=""
                onChange={async (e) => {
                  if (!e.target.files || e.target.files.length === 0) return;

                  const base64Images = await ImagesToBase64(
                    Array.from(e.target.files)
                  );
                  field.onChange(base64Images[0]);
                }}
              />
              <FormMessage />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Санаторий Москва" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Удобства</FormLabel>
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`facility-${facility.id}`}
                      checked={field.value?.includes(facility.id)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), facility.id]
                          : field.value?.filter((id) => id !== facility.id) ||
                            [];
                        field.onChange(newValue);
                      }}
                    />
                    <label
                      htmlFor={`facility-${facility.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {facility.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicalBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Медицинская база</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите медицинскую базу" />
                </SelectTrigger>
                <SelectContent>
                  {medicalBases.map((base) => (
                    <SelectItem key={base.id} value={base.id}>
                      {base.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatmentIndications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Показания для лечения</FormLabel>
              <div className="space-y-2">
                {treatmentIndications.map((indication) => (
                  <div
                    key={indication.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`treatment-${indication.id}`}
                      checked={field.value?.includes(indication.id)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), indication.id]
                          : field.value?.filter((id) => id !== indication.id) ||
                            [];
                        field.onChange(newValue);
                      }}
                    />
                    <label
                      htmlFor={`treatment-${indication.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {indication.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Рейтинг</FormLabel>
              <FormControl>
                <Input placeholder="Рейтинг" {...field} type="number" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Страна</FormLabel>
              <FormControl>
                <Input placeholder="Страна" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          loading={
            createHotelMutation.isPending || updateHotelMutation.isPending
          }
        >
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
