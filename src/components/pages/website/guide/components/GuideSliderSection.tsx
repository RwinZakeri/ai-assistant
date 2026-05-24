"use client";
import React from "react";
import { useScrollspy } from "@/hooks/useScrollspy";
import TableOfContents from "./TableOfContents";
import GuideContent from "./GuideContent";
import { GUIDE_TOC } from "../constants";

export default function GuideSliderSection() {
  const activeId = useScrollspy(GUIDE_TOC.map((t) => t.id));

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row justify-around items-start ">
      <TableOfContents toc={GUIDE_TOC} activeId={activeId} />

      <GuideContent />
    </div>
  );
}
