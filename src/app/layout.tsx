import ReactQueryProvider from "@/configs/ReactQueryProvider";
import ReduxProvider from "@/configs/ReduxProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

import { NProgressBar } from "@/components/ui/loading/NProgress";
import "leaflet/dist/leaflet.css";
import "nprogress/nprogress.css";
import { Suspense } from "react";

const pelak = localFont({
  src: [
    {
      path: "../../public/fonts/pelak/PelakFA.woff",

      style: "normal",
    },
  ],
  variable: "--font-pelak",
});

export const metadata: Metadata = {
  title: "AI Assistant App",
  description: "Next.js app with RTL support and shadcn/ui components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className={`${pelak.variable} antialiased`}>
        <Suspense>
          <NProgressBar />
        </Suspense>
        <ReduxProvider>
          <Toaster richColors />
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
