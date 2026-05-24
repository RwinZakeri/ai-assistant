"use client";

import Image from "next/image";
import Link from "next/link";

import { CategoriesService } from "@/apis";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu/index";
import getFileUrl from "@/utils/getFileUrl";
import { menuItems } from "./type";

export function DesktopMenu({
  categories,
}: {
  categories:
    | Awaited<
        ReturnType<
          typeof CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet
        >
      >
    | undefined;
}) {
  return (
    <NavigationMenu viewport={false} className="pr-16">
      <NavigationMenuList>
        {menuItems.map((item) =>
          item.hasChildren ? (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger>
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul
                  className="grid grid-cols-2 gap-x-10 gap-y-2 w-[470px]"
                  dir="rtl"
                >
                  {categories?.map((child) => {
                    const categoryId = child?.category?.id;
                    const href = categoryId
                      ? `/product?categories=${categoryId}`
                      : "/product";
                    return (
                      <li key={categoryId}>
                        <Link
                          href={href}
                          className="flex gap-4 items-center p-3 text-md-demibold hover:bg-gray-100/5 rounded-md transition-colors"
                        >
                          <Image
                            src={
                              getFileUrl(child.category?.categoryFile) || "/"
                            }
                            alt={child.category?.title || "category-icon"}
                            className="w-6 h-6"
                            width={24}
                            height={24}
                          />
                          {child.category?.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
