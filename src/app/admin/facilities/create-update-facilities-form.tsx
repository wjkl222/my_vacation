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
import type { Facility } from "~/lib/shared/types/facilities";
import { facilities } from './../../../server/db/facilities';

export const facilitieSchema = z.object({
  name: z
    .string({
      message: "Введите название",
    })
    .min(1, "Введите название"),
});

export default function CreateUpdateFacilitieForm({
  facilitie,
  onMutate,
}: {
  facilitie?: Facility;
  onMutate?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(facilitieSchema),
    defaultValues: (facilitie ?? {
      isFeatured: false,
    }) as z.infer<typeof facilitieSchema>,
  });

  const createFacilitieMutation = useMutation({
    mutationKey: ["create-facilitie"],
    mutationFn: async (data: z.infer<typeof facilitieSchema>) => {
      const { data: facilitie, error } = await api.facilities.index.post(data);

      if (error) throw new TreatyError(error);

      return facilitie;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["facilities"]);

      await queryClient.setQueryData(
        ["facilities"],
        async (old: Facility[]) =>
          [
            ...old,
            {
              id: crypto.randomUUID(),
              ...data,
            },
          ] as Facility[],
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Удобство успешно создана");
      form.reset();
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["facilities"] });
    },
  });

  const updateFacilitieMutation = useMutation({
    mutationKey: ["update-facilitie", facilitie?.id ?? ""],
    mutationFn: async (data: z.infer<typeof facilitieSchema>) => {
      const { data: facilities, error } = await api
        .facilities({ id: facilitie!.id })
        .put(data);
      if (error) throw new TreatyError(error);

      return facilities;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["facilities", facilitie!.id]);

      await queryClient.setQueryData(
        ["facilities", facilitie!.id],
        async (old: Facility) => ({
          ...old,
          ...data,
        }),
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Удобство успешно обновлена");
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["facilities"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof facilitieSchema>) => {
    if (facilitie) {
      await updateFacilitieMutation.mutateAsync(data);
    } else {
      await createFacilitieMutation.mutateAsync(data);
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
            createFacilitieMutation.isPending || updateFacilitieMutation.isPending
          }
        >
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
