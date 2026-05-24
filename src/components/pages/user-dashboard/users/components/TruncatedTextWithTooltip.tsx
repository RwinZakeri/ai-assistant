"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip/tooltip";

interface TruncatedTextWithTooltipProps {
  text: string;
  className?: string;
}

const TruncatedTextWithTooltip = ({
  text,
  className = "",
}: TruncatedTextWithTooltipProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflow =
          textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  const content = (
    <span
      ref={textRef}
      className={`truncate inline-block max-w-full ${className}`}
    >
      {text}
    </span>
  );

  if (isOverflowing) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

export default TruncatedTextWithTooltip;
