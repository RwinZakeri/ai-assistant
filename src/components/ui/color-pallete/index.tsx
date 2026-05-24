import { SpeakerAvailableColors } from "@/apis";
import { PlusplusIcon } from "@/assets/images/svg/Plusplus";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { CheckIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "../button";
import { PopoverContent, PopoverTrigger } from "../popover/popover";

const CollorPallet = ({
  colors,
  selectedColors,
  setSelectedColors,
}: {
  colors: SpeakerAvailableColors[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
}) => {
  const randomId = useId();
  const [tempSelectedColorIds, setTempSelectedColorIds] = useState<number[]>(
    []
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (isPopoverOpen && selectedColors) {
      const numericIds = selectedColors.map((id) => Number(id));
      setTempSelectedColorIds(numericIds);
    }
  }, [isPopoverOpen, selectedColors]);

  const getSelectedColorObjects = () => {
    if (!colors || !selectedColors || selectedColors.length === 0) return [];
    return colors.filter(
      (color) =>
        color.id !== undefined && selectedColors.includes(String(color.id))
    );
  };

  const handleColorClick = (colorId: number | undefined) => {
    if (colorId === undefined) return;
    setTempSelectedColorIds((prev) => {
      if (prev.includes(colorId)) {
        return prev.filter((id) => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  const handleSave = () => {
    const colorIdsAsStrings = tempSelectedColorIds.map((id) => String(id));
    setSelectedColors(colorIdsAsStrings);
    setIsPopoverOpen(false);
  };

  const isColorSelectedInTemp = (colorId: number | undefined) => {
    if (colorId === undefined) return false;
    return tempSelectedColorIds.includes(colorId);
  };

  const selectedColorObjects = getSelectedColorObjects();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedColorObjects.map((colorItem, index) => (
        <div
          key={`${randomId}-${index}`}
          className={cn(
            "w-10 h-10 flex items-center justify-center border border-solid rounded-lg border-linePrimary"
          )}
          style={{ backgroundColor: colorItem?.hexColor || "" }}
        ></div>
      ))}

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="w-10 h-10 flex items-center justify-center border border-solid rounded-lg border-linePrimary cursor-pointer hover:bg-surfaceSecondary transition-colors">
            <PlusplusIcon />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-60 bg-surfacePrimary z-[9999] rounded-lg my-2 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-lg text-gray-25">رنگ اسپیکر</p>
            <p className="text-sm text-textTertiary">
              از میان رنگ های زیر حداقل یک رنگ انتخاب کنید.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {!colors?.length
              ? "رنگی موجود نیست"
              : colors?.map((colorItem) => {
                  const colorId = colorItem.id;
                  if (colorId === undefined) return null;
                  return (
                    <div
                      onClick={() => handleColorClick(colorId)}
                      key={colorId}
                      className="w-10 h-10 flex items-center justify-center border border-solid rounded-lg border-linePrimary cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: colorItem?.hexColor || "" }}
                    >
                      {isColorSelectedInTemp(colorId) && (
                        <CheckIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                  );
                })}
          </div>
          <Button
            type="button"
            onClick={handleSave}
            variant="secondary"
            disabled={tempSelectedColorIds.length === 0}
          >
            ذخیره
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CollorPallet;
