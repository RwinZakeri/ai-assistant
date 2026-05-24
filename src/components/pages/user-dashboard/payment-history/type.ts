import { NetworkIcon } from "@/assets/images/svg/Network";
import { DropdownInputProps } from "@/components/ui/input/dropdown-input";
import { ComponentType } from "react";

export interface PaymentHistoryItem {
  id: number;
  topic: string;
  icon: ComponentType;
  account: string;
  amount: string;
  date: string;
}

export type paymentDateType = { from: string | null; to: string | null };

type DropdownOption = DropdownInputProps["options"][number];




export const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    id: 1,
    topic: "خرید اشتراک",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۲،۵۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۹/۱۵",
  },
  {
    id: 2,
    topic: "شارژ حساب",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۵،۰۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۹/۱۰",
  },
  {
    id: 3,
    topic: "خرید محصول",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۱،۲۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۹/۰۵",
  },
  {
    id: 4,
    topic: "بازگشت وجه",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۸۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۸/۲۸",
  },
  {
    id: 5,
    topic: "خرید اشتراک",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۳،۰۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۸/۲۰",
  },
  {
    id: 6,
    topic: "شارژ حساب",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۷،۵۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۸/۱۵",
  },
  {
    id: 7,
    topic: "خرید محصول",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۹۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۸/۱۰",
  },
  {
    id: 8,
    topic: "خرید اشتراک",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۲،۰۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۸/۰۵",
  },
  {
    id: 9,
    topic: "شارژ حساب",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۴،۵۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۷/۲۸",
  },
  {
    id: 10,
    topic: "خرید محصول",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۱،۵۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۷/۲۰",
  },
  {
    id: 11,
    topic: "بازگشت وجه",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۶۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۷/۱۵",
  },
  {
    id: 12,
    topic: "خرید اشتراک",
    icon: NetworkIcon,
    account: "user@example.com",
    amount: "۳،۵۰۰،۰۰۰ ریال",
    date: "۱۴۰۳/۰۷/۱۰",
  },
];
