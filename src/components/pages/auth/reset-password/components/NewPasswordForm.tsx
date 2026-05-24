"use client";

import { TokenAuthService } from "@/apis";
import { Mail01Icon } from "@/assets/images/svg/Mail01";
import { PhoneAuthIcon } from "@/assets/images/svg/PhoneAuth";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "../../components/components/password-input";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../schemas";

interface NewPasswordFormProps {
  mobileNumber: string;
  onEditMobile: () => void;
}

const NewPasswordForm = ({
  mobileNumber,
  onEditMobile,
}: NewPasswordFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (password: string) => {
      const res = await TokenAuthService.apiTokenauthAppsetnewpasswordPost({
        newPassword: password,
        confirmPassword: password,
      });
      return res;
    },
    onSuccess: () => {
      router.push("/auth");
      toast.success("رمز عبور با موفقیت تغییر کرد.");
    },
  });

  const handlePasswordChange = (value: string) => {
    setValue("password", value, { shouldValidate: true });
  };

  const passwordRequirements = [
    {
      text: "شامل حداقل ۸ کاراکتر باشد.",
      check: (pwd: string) => pwd.length >= 8,
    },
    {
      text: "شامل حداقل یک عدد (۰-۹) باشد.",
      check: (pwd: string) => /\d/.test(pwd),
    },
    {
      text: "شامل حداقل یک کاراکتر خاص مانند (!، @، #، $، %، &) باشد.",
      check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const onSubmit = (data: ResetPasswordFormData) => {
    updateProfile.mutate(data.password);
  };

  return (
    <div className="min-h-screen w-full bg-base-black flex items-center justify-center p-6">
      <div className="w-[358px] space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-xl border border-linePrimary flex items-center justify-center">
            <Mail01Icon className="h-7 w-7 text-base-white" />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="title-sm-demibold text-base-white">
            بازیابی رمز عبور
          </h1>
          <p className="text-sm-demibold text-textSecondary">
            برای تغییر رمز عبور خود، رمز جدید را وارد کنید.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordInput
            id="new-password"
            label="رمز عبور جدید"
            placeholder="رمز عبور جدید را اینجا بنویسید"
            error={errors.password?.message}
            showRequirements={true}
            requirements={passwordRequirements}
            convertPersianToEnglish={true}
            useWebkitTextSecurity={true}
            onPasswordChange={handlePasswordChange}
            {...register("password")}
          />

          <Button variant="primary" size="lg" className="w-full" type="submit">
            ادامه
          </Button>

          <div className="flex justify-center">
            <button
              onClick={onEditMobile}
              className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
            >
              <PhoneAuthIcon />
              اصلاح شماره موبایل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
