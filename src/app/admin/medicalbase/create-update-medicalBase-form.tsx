"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/lib/client/api";
import { OnError } from "~/lib/client/on_error";
import { queryClient } from "~/lib/client/query-client";
import { TreatyError } from "~/lib/shared/types/error";
import type { MedicalBase } from "~/lib/shared/types/medicalBase";

export const medicalBaseSchema = z.object({
  name: z
    .string({
      message: "Введите название",
    })
    .min(1, "Введите название"),
});

export default function CreateUpdateMedicalBaseForm({
  medicalBase,
  onMutate,
}: {
  medicalBase?: MedicalBase;
  onMutate?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(medicalBaseSchema),
    defaultValues: (medicalBase ?? {
      isFeatured: false,
    }) as z.infer<typeof medicalBaseSchema>,
  });

  const createMedicalBaseMutation = useMutation({
    mutationKey: ["create-medicalBase"],
    mutationFn: async (data: z.infer<typeof medicalBaseSchema>) => {
      const { data: medicalBase, error } = await api.medicalBase.index.post(data);

      if (error) throw new TreatyError(error);

      return medicalBase;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["medicalBases"]);

      await queryClient.setQueryData(
        ["medicalBases"],
        async (old: MedicalBase[]) =>
          [
            ...old,
            {
              id: crypto.randomUUID(),
              ...data,
            },
          ] as MedicalBase[],
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Лечебная база успешно создана");
      form.reset();
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["medicalBases"] });
    },
  });

  const updateMedicalBaseMutation = useMutation({
    mutationKey: ["update-medicalBase", medicalBase?.id ?? ""],
    mutationFn: async (data: z.infer<typeof medicalBaseSchema>) => {
      const { data: medicalBases, error } = await api
        .medicalBase({ id: medicalBase!.id })
        .put(data);
      if (error) throw new TreatyError(error);

      return medicalBases;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["medicalBase", medicalBase!.id]);

      await queryClient.setQueryData(
        ["medicalBase", medicalBase!.id],
        async (old: MedicalBase) => ({
          ...old,
          ...data,
        }),
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Лечебная база успешно обновлена");
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["medicalBases"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof medicalBaseSchema>) => {
    if (medicalBase) {
      await updateMedicalBaseMutation.mutateAsync(data);
    } else {
      await createMedicalBaseMutation.mutateAsync(data);
    }
  };

  const tags = useFieldArray({
    control: form.control,
    name: "tags" as never,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, OnError)}
        className="space-y-2"
      >
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

        <Button
          className="w-full"
          loading={
            createMedicalBaseMutation.isPending || updateMedicalBaseMutation.isPending
          }
        >
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
