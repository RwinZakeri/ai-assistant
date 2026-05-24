import { TechnicalDetail } from "../type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip/tooltip";

const TopTechnicalDetails = ({ details }: { details: TechnicalDetail[] }) => (
  <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 w-full">
    {details.map((detail, index) => (
      <div
        key={index}
        className="flex flex-col w-full md:w-[200px] md:flex-1 md:min-w-[140px] h-auto md:h-[86px] gap-1 p-3 md:p-4 bg-surfacePrimary rounded-xl md:rounded-2xl"
      >
        <span className="text-sm md:text-md-medium text-textSecondary line-clamp-1">
          {detail.title}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-base md:text-xl-bold text-gray-25 line-clamp-1">
              {detail.value}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">{detail.value}</TooltipContent>
        </Tooltip>
      </div>
    ))}
  </div>
);

export default TopTechnicalDetails;
