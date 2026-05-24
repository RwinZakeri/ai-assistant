import { Button } from "../button";

interface DateRangeActionsProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export function DateRangeActions({
  onConfirm,
  onCancel,
}: DateRangeActionsProps) {
  return (
    <div className="flex items-center gap-4 w-full p-4">
      <Button variant={"secondary"} onClick={onCancel}>
        انصراف
      </Button>
      <Button onClick={onConfirm} variant="primary">
        تایید
      </Button>
    </div>
  );
}
