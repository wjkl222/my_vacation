import {
  AdminContent,
  AdminDashboard,
  AdminHeader,
  AdminTitle,
} from "~/components/ui/admin";
import { TreatyError } from "~/lib/shared/types/error";
import { api } from "~/server/api";
import FacilitiesTable from "./table";

export default async function HotelsPage() {
  const { data: facilities, error } = await api.facilities.index.get();

  if (error) throw new TreatyError(error);

  return (
    <AdminDashboard>
      <AdminHeader>
        <AdminTitle>Удобства</AdminTitle>
      </AdminHeader>
      <AdminContent>
        <FacilitiesTable initialData={facilities.facilities} />
      </AdminContent>
    </AdminDashboard>
  );
}