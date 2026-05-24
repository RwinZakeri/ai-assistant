"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { CategoriesService } from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import { DesktopMenu } from "./components/DesktopMenu";
import { MobileMenu } from "./components/MobileMenu";

export function Menu({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: categories } = useQuery({
    queryKey: [ReactQuery.allAssistanceCategories],
    queryFn: () => {
      return CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet();
    },
  });

  const device = useDevice();
  const pathname = usePathname();

  React.useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [pathname, setMenuOpen]);

  React.useEffect(() => {
    if (menuOpen && device === "mobile") {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [menuOpen, device]);

  if (device === "desktop") {
    return <DesktopMenu categories={categories} />;
  }

  return (
    <MobileMenu
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      categories={categories}
    />
  );
}
