import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardDataBoxProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const DashboardDataBox = ({
  label,
  children,
  className,
}: DashboardDataBoxProps) => {
  return (
    <div
      className={cn(
        "w-full rounded-xl p-6 border border-gray-800 flex flex-col gap-2",
        className
      )}
    >
      <p className={cn("text-sm font-medium text-textSecondary", "text-right")}>
        {label}
      </p>
      <div className="w-full flex items-center justify-between">
        <p className="text-3xl font-semibold flex items-end gap-1">
          {children}
        </p>
      </div>
    </div>
  );
};

export default DashboardDataBox;
