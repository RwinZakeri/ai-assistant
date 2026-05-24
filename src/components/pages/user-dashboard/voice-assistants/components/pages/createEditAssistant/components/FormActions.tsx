'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { FormActionsProps } from '../types';

const FormActions = ({
  isEditMode,
  isSubmitting,
  isPending,
  onCancel,
}: FormActionsProps) => {
  const router = useRouter();

  return (
    <div className="flex w-full gap-4">
      <Button
        className="cursor-pointer"
        disabled={isSubmitting || isPending}
        loading={isSubmitting || isPending}
        size="lg"
        type="submit"
        variant="primary"
      >
        {isEditMode ? 'ذخیره تغییرات' : 'ذخیره'}
      </Button>
      <Button
        disabled={isSubmitting || isPending}
        size="lg"
        type="button"
        variant="secondary"
        onClick={() => {
          onCancel();
          router.push('/dashboard/voice-assistants');
        }}
      >
        انصراف
      </Button>
    </div>
  );
};

export default FormActions;
