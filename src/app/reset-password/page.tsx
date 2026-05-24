'use client";'
import ResetPassword from "@/components/pages/auth/reset-password";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
