import type { ReactNode } from "react";
import LandingNavbar from "./navbar";
import { Footer } from "./footer";
import { auth } from "~/server/auth/auth";
import { headers } from "next/headers";

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
