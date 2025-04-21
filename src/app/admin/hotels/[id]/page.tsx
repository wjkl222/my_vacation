import { notFound } from "next/navigation";
import {
  AdminContent,
  AdminDashboard,
  AdminHeader,
  AdminTitle,
} from "~/components/ui/admin";
import { TreatyError } from "~/lib/shared/types/error";
import { api } from "~/server/api";
import RoomsTable from "./rooms-table";

export default async function AdminHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: rooms, error } = await api
    .hotels.roomsByHotelId({id: (await params).id}).get();
  if (error) {
    throw new TreatyError(error);
  }

  return (
    <AdminDashboard>
      <AdminHeader>
        <AdminTitle>{rooms.rooms[0]?.hotel.name}</AdminTitle>
      </AdminHeader>
      <AdminContent className="space-y-6">
          <RoomsTable initialData={rooms.rooms} hotelId={(await params).id}/>
      </AdminContent>
    </AdminDashboard>
  );
}
