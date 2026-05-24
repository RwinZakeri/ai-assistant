"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input/text-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layouts/website/Header";
import Footer from "@/components/layouts/website/Footer";
import useDevice from "@/hooks/useDevice";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const device = useDevice();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full">
      <Header />
      <main className="mt-4 text-white flex flex-col md:flex-row">
        <div className="flex w-full md:w-1/2 h-auto md:h-[960px] items-center justify-center bg-black md:p-0">
          <div className="w-full md:w-[560px] flex flex-col gap-6 md:gap-12 items-start px-4 ">
            <div className="flex flex-col gap-4 md:gap-6 justify-center ">
              <p className="md:title-xl-demibold title-md-demibold">
                صفحه یافت نشد...
              </p>

              <p className="md:text-xl-regular text-lg-regular text-textTertiary leading-7">
                با عرض پوزش، صفحه ای که به دنبال آن هستید وجود ندارد یا منتقل
                شده است...
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex md:flex-row flex-col gap-4 w-full "
            >
              <TextInput
                placeholder="جستجو"
                size={40}
                className=" md:max-w-[320px] w-full "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Button type="submit" size={device === "mobile" ? "xl" : "lg"}>
                جستجو
              </Button>
            </form>
          </div>
        </div>

        <div className="overflow-hidden w-full md:w-1/2 h-[260px] p-4  md:p-0  md:h-[960px]">
          <Image
            src="/images/404desktop.png"
            alt="404 Error"
            width={800}
            height={600}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
