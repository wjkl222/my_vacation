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
import CreateUpdateHotelForm from "./create-update-hotel-form";
import { Hotel } from "~/lib/shared/types/hotel";

export default function CreateHotel({hotel} : {hotel: Hotel | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {hotel ? <Pencil/> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hotel ? "Обновить санаторий" : "Создать санаторий"}</DialogTitle>
        </DialogHeader>
        {hotel ? 
        (<CreateUpdateHotelForm onMutate={() => setOpen(false)} hotel={hotel}/>) : 
        (<CreateUpdateHotelForm onMutate={() => setOpen(false)}/>)}
      </DialogContent>
    </Dialog>
  );
}
