import { z } from "zod";

// Helper function to validate file type
const validateFileType = (file: File): boolean => {
  const validTypes = [
    "image/svg+xml",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];
  return validTypes.includes(file.type);
};

// Helper function to validate file size (5MB max)
const validateFileSize = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
};

// Technical specification schema
const technicalSpecSchema = z.object({
  title: z.string().min(1, "عنوان مشخصات فنی الزامی است"),
  description: z.string().min(1, "توضیحات مشخصات فنی الزامی است"),
  showontop: z.boolean(),
});

// Define the validation schema using Zod
export const addSpeakerSchema = z.object({
  // Thumbnail - single file, required
  thumbnail: z
    .union([z.instanceof(File), z.undefined()])
    .refine((file) => file !== undefined, "لطفا تصویر اصلی را انتخاب کنید")
    .refine((file) => {
      if (!file) return false;
      return validateFileType(file);
    }, "فقط فایل‌های SVG، JPG، PNG یا GIF مجاز هستند")
    .refine((file) => {
      if (!file) return false;
      return validateFileSize(file);
    }, "حجم فایل نباید بیشتر از ۵ مگابایت باشد"),

  // Other images - array of files, optional
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every(validateFileType);
    }, "فقط فایل‌های SVG، JPG، PNG یا GIF مجاز هستند")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every(validateFileSize);
    }, "حجم فایل‌ها نباید بیشتر از ۵ مگابایت باشد"),

  // Basic information
  name: z.string().min(1, "نام الزامی است"),
  deviceModel: z.string().min(1, "مدل دستگاه الزامی است"),
  price: z
    .string()
    .min(1, "قیمت الزامی است")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "قیمت باید یک عدد مثبت باشد"
    ),
  discountPercent: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
      "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد"
    ),
  quantity: z
    .string()
    .min(1, "موجودی الزامی است")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "موجودی باید یک عدد صحیح باشد"
    ),
  description: z
    .string()
    .min(1, "توضیحات الزامی است")
    .max(4000, "توضیحات نباید بیشتر از ۴۰۰۰ کاراکتر باشد"),

  // Colors - at least one required
  colors: z.array(z.string()).min(1, "حداقل یک رنگ باید انتخاب شود"),

  // Technical specifications
  technicalSpecs: z
    .array(technicalSpecSchema)
    .min(1, "حداقل یک مشخصه فنی باید اضافه شود")
    .refine(
      (specs) => specs.filter((s) => s.showontop).length <= 3,
      "حداکثر ۳ مورد می‌تواند برای نمایش در بالای صفحه انتخاب شود"
    ),
});

// Infer TypeScript type from the schema
export type AddSpeakerFormData = z.infer<typeof addSpeakerSchema>;

// Backend format type
export interface SpeakerFileInput {
  fileId: string;
  isThumbnail: boolean;
}

// Transform function to convert form data to backend format
// Note: You'll need to upload files first to get fileIds, then use this format
export const transformToBackendFormat = (
  thumbnailFileId: string,
  otherImageFileIds: string[]
): SpeakerFileInput[] => {
  const files: SpeakerFileInput[] = [
    {
      fileId: thumbnailFileId,
      isThumbnail: true,
    },
    ...otherImageFileIds.map((fileId) => ({
      fileId,
      isThumbnail: false,
    })),
  ];

  return files;
};
