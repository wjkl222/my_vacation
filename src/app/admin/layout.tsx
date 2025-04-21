import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "~/server/auth/auth";
import AdminNavbar from "./navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin" || !session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 mt-32">
        {children}
      </main>
    </div>
  );
}
