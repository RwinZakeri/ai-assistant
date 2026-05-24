"use client";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const HeaderDashboard = ({
  children,
  label,
  actionButton,
  contentClassName,
  wrapperClassName,
  headerClassName,
  headerButton,
}: {
  children: ReactNode;
  label: string;
  actionButton?: ReactNode;
  headerButton?: ReactNode;
  contentClassName?: string;
  wrapperClassName?: string;
  headerClassName?: string;
}) => {
  const path = usePathname();
  const navigate = useRouter();

  const multiPath = path.split("/").length >= 4;

  const navigationHandler = () => {
    if (multiPath) {
      navigate.back();
    }
  };

  return (
    <div className={cn("pb-3 relative w-full", wrapperClassName)}>
      <div>
        <div
          className={cn(
            "pt-12 pb-6 w-full flex justify-between items-center border-b sticky top-0 left-0 bg-base-black z-50 border-gray-800 mb-6 px-8",
            headerClassName
          )}
        >
          <p
            onClick={navigationHandler}
            className={cn(
              multiPath && "cursor-pointer",
              "text-2xl w-fit font-semibold flex items-center gap-2"
            )}
          >
            {multiPath && <ArrowRight />} {label}
          </p>

          {actionButton}
          {headerButton}
        </div>
      </div>
      <div className={cn(`w-full px-8`, contentClassName)}>{children}</div>
    </div>
  );
};

export default HeaderDashboard;
