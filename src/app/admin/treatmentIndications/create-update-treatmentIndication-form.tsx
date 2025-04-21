"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
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
import type { TreatmentIndication } from "~/lib/shared/types/treatmentIndications";

export const treatmentIndicationSchema = z.object({
  name: z
    .string({
      message: "Введите название",
    })
    .min(1, "Введите название"),
});

export default function CreateUpdateTreatmentIndicationForm({
  treatmentIndication,
  onMutate,
}: {
  treatmentIndication?: TreatmentIndication;
  onMutate?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(treatmentIndicationSchema),
    defaultValues: (treatmentIndication ?? {
      isFeatured: false,
    }) as z.infer<typeof treatmentIndicationSchema>,
  });

  const createTreatmentIndicationMutation = useMutation({
    mutationKey: ["create-treatmentIndication"],
    mutationFn: async (data: z.infer<typeof treatmentIndicationSchema>) => {
      const { data: treatmentIndication, error } = await api.treatmentIndications.index.post(data);

      if (error) throw new TreatyError(error);

      return treatmentIndication;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["treatmentIndications"]);

      await queryClient.setQueryData(
        ["treatmentIndications"],
        async (old: TreatmentIndication[]) =>
          [
            ...old,
            {
              id: crypto.randomUUID(),
              ...data,
            },
          ] as TreatmentIndication[],
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Показания к лечению успешно созданы");
      form.reset();
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["treatmentIndications"] });
    },
  });

  const updateTreatmentIndicationMutation = useMutation({
    mutationKey: ["update-treatmentIndication", treatmentIndication?.id ?? ""],
    mutationFn: async (data: z.infer<typeof treatmentIndicationSchema>) => {
      const { data: treatmentIndications, error } = await api
        .treatmentIndications({ id: treatmentIndication!.id })
        .put(data);
      if (error) throw new TreatyError(error);

      return treatmentIndications;
    },
    onMutate: async (data) => {
      const snapshot = await queryClient.getQueryData(["treatmentIndication", treatmentIndication!.id]);

      await queryClient.setQueryData(
        ["treatmentIndication", treatmentIndication!.id],
        async (old: TreatmentIndication) => ({
          ...old,
          ...data,
        }),
      );

      onMutate?.();

      return snapshot;
    },
    onSuccess: () => {
      toast.success("Показания к лечению успешно обновлены");
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: ["treatmentIndications"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof treatmentIndicationSchema>) => {
    if (treatmentIndication) {
      await updateTreatmentIndicationMutation.mutateAsync(data);
    } else {
      await createTreatmentIndicationMutation.mutateAsync(data);
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
            createTreatmentIndicationMutation.isPending || updateTreatmentIndicationMutation.isPending
          }
        >
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
