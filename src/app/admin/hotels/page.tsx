import {
  AdminContent,
  AdminDashboard,
  AdminHeader,
  AdminTitle,
} from "~/components/ui/admin";
import { TreatyError } from "~/lib/shared/types/error";
import { api } from "~/server/api";
import HotelsTable from "./table";
import MedicalBasesTable from "../medicalbase/table";

export default async function HotelsPage() {
  const { data: hotels, error } = await api.hotels.all.get();

  if (error) throw new TreatyError(error);

  return (
    <AdminDashboard>
      <AdminHeader>
        <AdminTitle>Санатории</AdminTitle>
      </AdminHeader>
      <AdminContent>
        <HotelsTable initialData={hotels.hotels} />
      </AdminContent>
    </AdminDashboard>
  );
}
