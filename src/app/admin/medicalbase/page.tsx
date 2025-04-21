import {
  AdminContent,
  AdminDashboard,
  AdminHeader,
  AdminTitle,
} from "~/components/ui/admin";
import { TreatyError } from "~/lib/shared/types/error";
import { api } from "~/server/api";
import TreatmentIndicationsTable from "./table";

export default async function HotelsPage() {
  const { data: medicalBases, error } = await api.medicalBase.index.get();

  if (error) throw new TreatyError(error);

  return (
    <AdminDashboard>
      <AdminHeader>
        <AdminTitle>Лечебные базы</AdminTitle>
      </AdminHeader>
      <AdminContent>
        <TreatmentIndicationsTable initialData={medicalBases.medicalBase} />
      </AdminContent>
    </AdminDashboard>
  );
}