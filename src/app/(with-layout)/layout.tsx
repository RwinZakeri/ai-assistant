import Footer from "@/components/layouts/website/Footer";
import Header from "@/components/layouts/website/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-dvh max-h-[100vh] md:overflow-auto overflow-x-hidden overflow-y-auto ">
      <Header />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}
