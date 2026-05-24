'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { Trash01Icon } from '@/assets/images/svg/Trash01';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextInput } from '@/components/ui/input/text-input';
import type { TechnicalSpecsSectionProps } from '../types';

const TechnicalSpecsSection = ({
  control,
  errors,
  technicalSpecs,
  onSpecChange,
  onAddSpec,
  onDeleteSpec,
}: TechnicalSpecsSectionProps) => {
  return (
    <>
      <div>
        <p className="text-lg text-gray-25">مشخصات فنی اسپیکر</p>
        <p className="text-sm text-textSecondary">
          از میان مشخصات زیر ۳ مورد از مهم‌ترین ها را انتخاب کرده تا در بالای
          صفحه نمایش داده شود.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {technicalSpecs?.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <Checkbox
              id={`technical-detail-${index}`}
              checked={spec.showontop}
              onCheckedChange={checked =>
                onSpecChange(index, 'showontop', checked === true)
              }
            />
            <TextInput
              className="w-full mx-auto"
              placeholder="عنوان"
              value={spec.title}
              onChange={e => onSpecChange(index, 'title', e.target.value)}
              error={errors.technicalSpecs?.[index]?.title?.message}
            />
            <TextInput
              className="w-full mx-auto"
              placeholder="توضیحات"
              value={spec.description}
              onChange={e =>
                onSpecChange(index, 'description', e.target.value)
              }
              error={errors.technicalSpecs?.[index]?.description?.message}
            />
            {index === (technicalSpecs?.length || 0) - 1 ? (
              <Button
                size={'sm'}
                className="w-10 h-10"
                type="button"
                onClick={onAddSpec}
              >
                <PlusplusIcon />
              </Button>
            ) : (
              <Button
                size={'sm'}
                className="w-10 h-10"
                variant="destructive"
                type="button"
                onClick={() => onDeleteSpec(index)}
              >
                <Trash01Icon stroke="#fff" />
              </Button>
            )}
          </div>
        ))}
        {errors.technicalSpecs &&
          typeof errors.technicalSpecs.message === 'string' && (
            <p className="text-sm text-destructive text-right">
              {errors.technicalSpecs.message}
            </p>
          )}
      </div>
    </>
  );
};

export default TechnicalSpecsSection;

