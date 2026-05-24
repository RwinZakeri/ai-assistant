import { cn } from "@/lib/utils";
import React from "react";

interface LabeledInputRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

const LabeledInputRow = ({
  label,
  children,
  className,
  labelClassName,
}: LabeledInputRowProps) => {
  return (
    <div className={cn("flex gap-2 py-5 border-b border-gray-800", className)}>
      <p className={cn("min-w-[100px]", labelClassName)}>{label}</p>
      {children}
    </div>
  );
};

export default LabeledInputRow;
