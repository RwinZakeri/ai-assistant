import { z } from "zod";
import { passwordSchema } from "@/components/pages/auth/schemas";

export const changePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمزهای عبور مطابقت ندارند.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const iranPhoneRegex = /^09\d{9}$/;
const postalCodeRegex = /^\d{10}$/;

export const accountDetailsSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || iranPhoneRegex.test(val),
      "شماره موبایل معتبر نیست"
    ),

  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "ایمیل معتبر نیست"
    ),

  addressLine: z.string().optional(),
  plaque: z.string().optional(),
  unit: z.string().optional(),

  postalCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || postalCodeRegex.test(val),
      "کد پستی باید ۱۰ رقم باشد"
    ),
});

export type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>;
