import { z } from 'zod';

const validateFileType = (file: File): boolean => {
  const validTypes = [
    'image/svg+xml',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];
  return validTypes.includes(file.type);
};

const validateFileSize = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024;
  return file.size <= maxSize;
};

// Pricing item schema with optional fields (validation is handled conditionally at root level)
const pricingItemSchema = z.object({
  duration: z.string().optional(),
  price: z.string().optional(),
  discount: z.string().optional(),
});

export const createEditAssistantSchema = z
  .object({
    images: z
      .array(z.instanceof(File))
      .optional()
      .refine(files => {
        if (!files || files.length === 0) {
          return true;
        }
        return files.every(validateFileType);
      }, 'فقط فایل‌های SVG، JPG، PNG یا GIF مجاز هستند')
      .refine(files => {
        if (!files || files.length === 0) {
          return true;
        }
        return files.every(validateFileSize);
      }, 'حجم فایل‌ها نباید بیشتر از ۵ مگابایت باشد'),

    isActive: z.boolean(),

    usePublicKnowledge: z.boolean(),

    persianName: z
      .string()
      .min(1, 'نام فارسی الزامی است')
      .min(2, 'نام فارسی باید حداقل ۲ کاراکتر باشد')
      .max(200, 'نام فارسی نباید بیشتر از ۲۰۰ کاراکتر باشد'),

    englishName: z
      .string()
      .min(1, 'نام انگلیسی الزامی است')
      .min(2, 'نام انگلیسی باید حداقل ۲ کاراکتر باشد')
      .max(200, 'نام انگلیسی نباید بیشتر از ۲۰۰ کاراکتر باشد'),

    llmDescription: z
      .string()
      .optional()
      .refine(
        val => !val || val.length <= 5000,
        'توضیحات برای LLM نباید بیشتر از ۵۰۰۰ کاراکتر باشد',
      ),

    userDescription: z
      .string()
      .optional()
      .refine(
        val => !val || val.length <= 5000,
        'توضیحات برای کاربر نباید بیشتر از ۵۰۰۰ کاراکتر باشد',
      ),

    voiceTone: z.array(z.string().min(1, 'لحن بیان ویس الزامی است')).optional(),

    characteristics: z
      .array(
        z.object({
          title: z.string().min(1, 'عنوان مشخصه الزامی است'),
        }),
      )
      .optional(),

    systemLlmPrompt: z
      .string()
      .optional()
      .refine(
        val => !val || val.length <= 10000,
        'پرامپت سیستمی LLM نباید بیشتر از ۱۰۰۰۰ کاراکتر باشد',
      ),

    selectedLanguages: z
      .array(z.number().int().positive())
      .min(1, 'حداقل یک زبان باید انتخاب شود'),

    subscriptionType: z.enum(['0', '1', '2'], {
      message:
        'نوع اشتراک الزامی است و باید یکی از مقادیر رایگان، زماندار یا اعتباری باشد',
    }),

    pricing: z.array(pricingItemSchema).optional(),

    assistantRedLines: z
      .string()
      .optional()
      .refine(
        val => !val || val.length <= 5000,
        'خط قرمزهای دستیار نباید بیشتر از ۵۰۰۰ کاراکتر باشد',
      ),
  })
  .superRefine((data, ctx) => {
    // Only validate pricing if subscriptionType is not '0' (free plan)
    if (data.subscriptionType !== '0') {
      // Check if pricing array exists and has at least one item
      if (
        !data.pricing ||
        !Array.isArray(data.pricing) ||
        data.pricing.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'برای اشتراک زماندار یا اعتباری، حداقل یک قیمت باید تعریف شود',
          path: ['pricing'],
        });
      } else {
        // Validate each pricing item only when subscriptionType is not '0'
        data.pricing.forEach((item, index) => {
          if (!item.duration || item.duration.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'مدت زمان اشتراک الزامی است',
              path: ['pricing', index, 'duration'],
            });
          } else if (
            isNaN(Number(item.duration)) ||
            Number(item.duration) <= 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'مدت زمان باید یک عدد مثبت باشد',
              path: ['pricing', index, 'duration'],
            });
          }

          if (!item.price || item.price.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'قیمت الزامی است',
              path: ['pricing', index, 'price'],
            });
          } else if (isNaN(Number(item.price)) || Number(item.price) < 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'قیمت باید یک عدد معتبر باشد',
              path: ['pricing', index, 'price'],
            });
          }

          if (item.discount && item.discount.trim() !== '') {
            const discountNum = Number(item.discount);
            if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'درصد تخفیف باید بین ۰ تا ۱۰۰ باشد',
                path: ['pricing', index, 'discount'],
              });
            }
          }
        });
      }
    }
    // If subscriptionType is '0', skip all pricing validation
  });

export type CreateEditAssistantFormData = z.infer<
  typeof createEditAssistantSchema
>;
