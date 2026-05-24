'use client';

import { Button } from '@/components/ui/button';
import type { FormActionsProps } from '../types';

const FormActions = ({
  isEditMode,
  isSubmitting,
  isPending,
  isValid,
  thumbnailFileId,
  onReset,
}: FormActionsProps) => {
  return (
    <div className="flex justify-start gap-4 pt-4">
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={
          isSubmitting ||
          isPending ||
          (!isEditMode && (!thumbnailFileId || !isValid))
        }
      >
        {isSubmitting || isPending
          ? 'در حال ارسال...'
          : isEditMode
            ? 'ذخیره تغییرات'
            : 'ثبت'}
      </Button>
      <Button
        type="reset"
        variant="secondary"
        size="lg"
        onClick={onReset}
        disabled={isSubmitting || isPending}
      >
        {isSubmitting || isPending ? 'در حال ارسال...' : 'انصراف'}
      </Button>
    </div>
  );
};

export default FormActions;

