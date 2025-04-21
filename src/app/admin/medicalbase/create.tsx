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
import CreateUpdateMedicalBaseForm from "./create-update-medicalBase-form";
import { MedicalBase } from "~/lib/shared/types/medicalBase";

export default function CreateMedicalBase({medicalBase} : {medicalBase?: MedicalBase}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {medicalBase ? <Pencil/> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{medicalBase ? "Изменить лечебную базу" : "Создать лечебную базу"}</DialogTitle>
        </DialogHeader>
        <CreateUpdateMedicalBaseForm onMutate={() => setOpen(false)} medicalBase={medicalBase}/>
      </DialogContent>
    </Dialog>
  );
}