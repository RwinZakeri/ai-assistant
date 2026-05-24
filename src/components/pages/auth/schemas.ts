import { z } from "zod";
import { persianToEnglish } from "@/utils/persianToEnglish";

const nameRegex = /^(?!.*\u0640)[\p{L}\p{M}\s]+$/u;

const mobileNumberSchema = z
  .string()
  .min(1, "شماره موبایل الزامی است")
  .transform((val) => persianToEnglish(val))
  .refine(
    (val) => /^09\d{9}$/.test(val),
    "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"
  );

export const passwordSchema = z
  .string()
  .min(1, "رمز عبور الزامی است")
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .regex(/\p{Nd}/u, "رمز عبور باید شامل حداقل یک عدد (۹-۰) باشد")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "رمز عبور باید شامل حداقل یک کاراکتر خاص مانند !@# باشد"
  );

export const loginSchema = z.object({
  mobileNumber: mobileNumberSchema,
  rememberMe: z.boolean(),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "کد تأیید الزامی است")
    .length(5, "کد تأیید باید ۵ رقم باشد")
    .regex(/^\d{5}$/, "کد تأیید باید فقط شامل اعداد باشد"),
});

export const passwordLoginSchema = z.object({
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .regex(nameRegex, "نام فقط می‌تواند شامل حروف فارسی یا انگلیسی باشد")
    .refine(
      (val) => !/[\d\u06F0-\u06F9]/.test(val),
      "نام نمی‌تواند شامل عدد باشد"
    ),
  lastName: z
    .string()
    .min(1, "نام خانوادگی الزامی است")
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .regex(
      nameRegex,
      "نام خانوادگی فقط می‌تواند شامل حروف فارسی یا انگلیسی باشد"
    )
    .refine(
      (val) => !/[\d\u06F0-\u06F9]/.test(val),
      "نام خانوادگی نمی‌تواند شامل عدد باشد"
    ),
  mobileNumber: mobileNumberSchema,
  password: passwordSchema,
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "لطفاً شرایط و ضوابط را بپذیرید"),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type PasswordLoginFormData = z.infer<typeof passwordLoginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
