import { z } from 'zod';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const deliveryTimeSchema = z
  .object({
    day: z.string().min(1, 'روز الزامی است'),
    startTime: z
      .string()
      .min(1, 'ساعت شروع الزامی است')
      .refine(val => timeRegex.test(val), 'فرمت زمان معتبر نیست (مثال: 09:30)'),
    endTime: z
      .string()
      .min(1, 'ساعت پایان الزامی است')
      .refine(val => timeRegex.test(val), 'فرمت زمان معتبر نیست (مثال: 18:00)'),
    amount: z
      .string()
      .min(1, 'مبلغ الزامی است')
      .refine(val => {
        const numValue = Number(val);
        return !isNaN(numValue) && numValue > 0;
      }, 'مبلغ باید بزرگ‌تر از صفر باشد'),
  })
  .refine(
    data => {
      if (!data.startTime || !data.endTime) {
        return true;
      }
      if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
        return true;
      }
      const startMinutes = parseTimeToMinutes(data.startTime);
      const endMinutes = parseTimeToMinutes(data.endTime);
      return startMinutes < endMinutes;
    },
    {
      message: 'ساعت شروع باید از ساعت پایان کوچکتر باشد',
      path: ['startTime'],
    },
  );

export type DeliveryTimeFormValues = z.infer<typeof deliveryTimeSchema>;
