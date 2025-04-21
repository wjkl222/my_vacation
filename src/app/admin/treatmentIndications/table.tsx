"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import type { TreatmentIndication } from "~/lib/shared/types/treatmentIndications";
import CreateTreatmentIndication from "./create";
import { toast } from "sonner";
import { queryClient } from "~/lib/client/query-client";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";



function DeleteTreatmentIndication ({id}: {id: string}) {
  const deleteMutation = useMutation({
    mutationKey: ["deleteTreatmentIndication"],
    mutationFn: async (id: string) => {
      api.treatmentIndications({id: id}).delete()
    },
    onSuccess: () => {
      toast.success("Удаление прошло успешно")
      queryClient.refetchQueries({
        queryKey: ["treatmentIndications"]
      })
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    }
  })
  return <Button onClick={() => deleteMutation.mutate(id)}><Trash2/></Button>
}


const columns: ColumnDef<TreatmentIndication>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: () => (
      <div className="justify-end items-center flex">
        <CreateTreatmentIndication />
      </div>
    ),
    cell: ({row}) => (
      <div className="flex flex-row space-y-3 items-center justify-end">
        <CreateTreatmentIndication treatmentIndication={row.original}/>
        <DeleteTreatmentIndication id={row.original.id}/>
      </div>
    )
  },
];

export default function TreatmentIndicationsTable({
  initialData,
}: {
  initialData: TreatmentIndication[];
}) {
  const { data: treatmentIndications } = useQuery({
    queryKey: ["treatmentIndications"],
    queryFn: async () => {
      const { data, error } = await api.treatmentIndications.index.get();

      if (error) throw new TreatyError(error);

      return data.treatmentIndications;
    },
    initialData,
  });

  return <DataTable columns={columns} data={treatmentIndications} />;
}
