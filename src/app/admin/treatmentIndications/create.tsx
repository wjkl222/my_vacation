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
import CreateUpdateTreatmentIndicationForm from "./create-update-treatmentIndication-form";
import { TreatmentIndication } from "~/lib/shared/types/treatmentIndications";


export default function CreateTreatmentIndication({treatmentIndication} : {treatmentIndication?: TreatmentIndication}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {treatmentIndication ? <Pencil/> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{treatmentIndication ? "Обновить показания к лечению" : "Создать показания к лечению"}</DialogTitle>
        </DialogHeader>
        <CreateUpdateTreatmentIndicationForm onMutate={() => setOpen(false)} treatmentIndication={treatmentIndication}/>
      </DialogContent>
    </Dialog>
  );
}

