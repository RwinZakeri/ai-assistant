"use client";

import Image from "next/image";
import Link from "next/link";

import { CategoriesService } from "@/apis";
import { LogIn01Icon } from "@/assets/images/svg/LogIn01";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import getFileUrl from "@/utils/getFileUrl";
import { AnimatePresence, motion } from "framer-motion";
import { menuItems } from "./type";

export function MobileMenu({
  menuOpen,
  setMenuOpen,
  categories,
}: {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories:
    | Awaited<
        ReturnType<
          typeof CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet
        >
      >
    | undefined;
}) {
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            onClick={handleLinkClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-0 right-0 w-full flex flex-col z-50 gap-2 bg-base-black max-h-[calc(100vh-5rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
          >
            <Accordion
              type="single"
              collapsible
              className="w-full flex flex-col gap-2"
            >
              {[...menuItems].reverse().map((item) => (
                <div key={item.title} className="w-full">
                  {item.hasChildren ? (
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="w-full px-4 py-3 text-gray-100 hover:no-underline hover:bg-gray-800/50">
                        <Link
                          href={item.href}
                          onClick={handleLinkClick}
                          className=""
                        >
                          {item.title}
                        </Link>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-1 px-4 pb-3">
                          {categories?.map((child) => {
                            const categoryId = child?.category?.id;
                            const href = categoryId
                              ? `/product?categories=${categoryId}`
                              : "/product";
                            return (
                              <Link
                                key={categoryId}
                                href={href}
                                onClick={handleLinkClick}
                                className="flex gap-4 items-center p-2 text-md-demibold text-gray-100 hover:text-gray-200 hover:bg-gray-800/30 rounded-md transition-colors"
                              >
                                <Image
                                  src={
                                    getFileUrl(child.category?.categoryFile) ||
                                    "/"
                                  }
                                  alt={child.category?.title || "category-icon"}
                                  className="w-6 h-6"
                                  width={24}
                                  height={24}
                                />
                                {child.category?.title}
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className="w-full h-12 px-4 text-gray-100 py-3 flex items-center hover:bg-gray-800/50 transition-colors"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </Accordion>

            <div className="p-6 w-full">
              <Button variant={"primary"} className="w-full" size="lg">
                <Link href="/auth" className="flex items-center gap-2">
                  <LogIn01Icon aria-hidden="true" /> ورود/ ثبت نام
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
