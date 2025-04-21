"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/lib/client/api";
import { TreatyError } from "~/lib/shared/types/error";
import { Facility } from "~/lib/shared/types/facilities";
import CreateFacility from "./create";
import { toast } from "sonner";
import { queryClient } from "~/lib/client/query-client";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";


function DeleteFacility({id}: {id: string}) {
  const deleteMutation = useMutation({
    mutationKey: ["deleteFacility"],
    mutationFn: async (id: string) => {
      api.facilities({id: id}).delete();
    }, 
    onSuccess: () => {
      toast.success("Удаление прошло успешно")
      queryClient.refetchQueries({
        queryKey: ["facilities"]
      })
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    }
  })

  return <Button onClick={() => deleteMutation.mutate(id)}><Trash2/></Button>
}


const columns: ColumnDef<Facility>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: () => (
      <div className="justify-end items-center flex">
        <CreateFacility />
      </div>
    ),
    cell: ({row}) => (
      <div className="flex flex-row space-x-3 justify-end">
        <CreateFacility facility={row.original}/>
        <DeleteFacility id={row.original.id}/>
      </div>
    )
  },
];

export default function FacilitiesTable({
  initialData,
}: {
  initialData: Facility[];
}) {
  const { data: facilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await api.facilities.index.get();

      if (error) throw new TreatyError(error);

      return data.facilities;
    },
    initialData,
  });

  return <DataTable columns={columns} data={facilities} />;
}
