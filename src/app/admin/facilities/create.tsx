"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateUpdateFacilityForm from "./create-update-facilities-form";
import { Facility } from "~/lib/shared/types/facilities";

export default function CreateFacility({facility} : {facility?: Facility}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {facility ? <Pencil/> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{facility ? "Изменить удобство" : "Создать удобство"}</DialogTitle>
        </DialogHeader>
        <CreateUpdateFacilityForm onMutate={() => setOpen(false)} facilitie={facility}/>
      </DialogContent>
    </Dialog>
  );
}