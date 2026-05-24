import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است")
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  subject: z
    .string()
    .min(1, "موضوع الزامی است")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      "موضوع معتبر انتخاب نشده است"
    ),
  description: z
    .string()
    .min(1, "توضیحات الزامی است")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد"),
  attachment: z
    .union([z.instanceof(File), z.null()])
    .optional()
    .refine((file) => {
      if (!file) return true;
      const validTypes = [
        "image/svg+xml",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      return validTypes.includes(file.type);
    }, "فقط فایل‌های SVG، JPG، PNG یا GIF مجاز هستند")
    .refine((file) => {
      if (!file) return true;
      const maxSize = 5 * 1024 * 1024; // 5MB
      return file.size <= maxSize;
    }, "حجم فایل نباید بیشتر از ۵ مگابایت باشد"),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
