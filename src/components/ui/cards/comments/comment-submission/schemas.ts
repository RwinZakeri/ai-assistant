import { z } from "zod";

export const commentFormSchema = z.object({
  rating: z
    .number()
    .min(1, "لطفاً امتیاز خود را انتخاب کنید")
    .max(5, "امتیاز باید بین ۱ تا ۵ باشد"),
  comment: z
    .string()
    .min(10, "نظر باید حداقل ۱۰ کاراکتر باشد"),
});

export type CommentFormData = z.infer<typeof commentFormSchema>;

