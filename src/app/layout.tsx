import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "~/components/ui/sonner";
import QueryClientProviderContext from "./query-client-provider";
import { Suspense } from "react";

const main_font = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мой отдых",
  icons: [{ rel: "icon", url: "/Logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${main_font.variable} font-main`}>
      <body>
        <NuqsAdapter>
          <QueryClientProviderContext><Suspense>{children}</Suspense></QueryClientProviderContext>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
