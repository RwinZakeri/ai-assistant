"use client";
import React from "react";
import { LinkedinIcon } from "@/assets/images/svg/Linkedin";
import { InstagramIcon } from "@/assets/images/svg/Instagram";
import { TwitterIcon } from "@/assets/images/svg/Twitter";
import { TelegramIcon } from "@/assets/images/svg/Telegram";
import { scrollToSection } from "@/utils/scrollToSection";

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  toc: readonly TOCItem[];
  activeId: string;
}

// Social Icon Component
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 bg-surfaceSecondary rounded-lg border border-linePrimary flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 transition-colors cursor-pointer">
    {children}
  </div>
);

export default function TableOfContents({
  toc,
  activeId,
}: TableOfContentsProps) {
  const handleScrollToSection = (itemId: string) => {
    scrollToSection(itemId, 30);
  };

  return (
    <div className="w-[240px] h-[310px] hidden sticky top-[30px] lg:flex flex-col justify-around ml-5">
      <div className="w-full overflow-visible whitespace-nowrap text-md-demibold text-textSecondary">
        <div className="mt-5 mb-3">
          <h3 className="text-textTertiary">فهرست مطالب</h3>
        </div>
        <nav
          className="flex flex-col gap-2 text-md-demibold text-textSecondary"
          dir="rtl"
        >
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection(item.id);
              }}
              className={`transition-colors cursor-pointer w-fit ${
                activeId === item.id
                  ? "text-gray-25 text-md-bold"
                  : "text-textSecondary hover:text-linePrimary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="w-full h-[100px] flex flex-row gap-3 items-end">
        <SocialIcon>
          <LinkedinIcon className="w-5 h-5" />
        </SocialIcon>
        <SocialIcon>
          <InstagramIcon className="w-5 h-5" />
        </SocialIcon>
        <SocialIcon>
          <TwitterIcon className="w-5 h-5" />
        </SocialIcon>
        <SocialIcon>
          <TelegramIcon className="w-5 h-5" />
        </SocialIcon>
      </div>
    </div>
  );
}
