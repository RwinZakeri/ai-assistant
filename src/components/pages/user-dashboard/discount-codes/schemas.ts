import { z } from 'zod';

export const discountCodeSchema = z
  .object({
    code: z.string().min(1, 'کد تخفیف الزامی است'),
    percentage: z
      .number()
      .int('درصد تخفیف باید یک عدد صحیح باشد')
      .min(1, 'درصد تخفیف باید حداقل ۱ باشد')
      .max(100, 'درصد تخفیف باید حداکثر ۱۰۰ باشد'),
    voiceAssistants: z.array(z.string()),
    devices: z.array(z.string()),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    creationDate: z.string().optional(),
  })
  .refine(data => !!data.startDate || !!data.endDate, {
    message: 'تاریخ اعتبار الزامی است',
    path: ['endDate'],
  })
  .refine(data => data.voiceAssistants.length > 0 || data.devices.length > 0, {
    message: 'حداقل یکی از دستیار صوتی یا مدل دستگاه باید انتخاب شود',
    path: ['voiceAssistants'],
  });

export type DiscountCodeFormData = z.infer<typeof discountCodeSchema>;
