"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import type { MedicalBase } from "~/lib/shared/types/medicalBase";
import CreateMedicalBase from "./create";
import { toast } from "sonner";
import { queryClient } from "~/lib/client/query-client";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";

function DeleteMedicalBase ({id}: {id: string}) {
  const deleteMutation = useMutation({
    mutationKey: ["deleteMedicalBase"],
    mutationFn: async(id: string) => {
      await api.medicalBase({id: id}).delete();
    },
    onSuccess: () => {
      toast.success("Удаление прошло успешно")
      queryClient.refetchQueries({
        queryKey: ["medicalBases"]
      })
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    }
  })

  return <Button onClick={() => deleteMutation.mutate(id)}><Trash2/></Button>
}


const columns: ColumnDef<MedicalBase>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: () => (
      <div className="justify-end items-center flex">
        <CreateMedicalBase/>
      </div>
    ),
    cell: ({row}) => (
      <div className="flex flex-row space-x-3 justify-end">
        <CreateMedicalBase medicalBase={row.original}/>
        <DeleteMedicalBase id={row.original.id}/>
      </div>
    )
  },
];

export default function MedicalBasesTable({
  initialData,
}: {
  initialData: MedicalBase[];
}) {
  const { data: medicalBases } = useQuery({
    queryKey: ["medicalBases"],
    queryFn: async () => {
      const { data, error } = await api.medicalBase.index.get();

      if (error) throw new TreatyError(error);

      return data.medicalBase;
    },
    initialData,
  });

  return <DataTable columns={columns} data={medicalBases} />;
}
