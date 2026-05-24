import { ReciveWalletIcon } from "@/assets/images/svg/ReciveWallet";
import { SendWalletIcon } from "@/assets/images/svg/SendWallet";
import { ComponentType } from "react";

export interface WalletTransactionRow {
  id: string;
  title: string;
  icon: ComponentType;
  amount: string;
  date: string;
}

export const walletTransactionRows: WalletTransactionRow[] = [
  {
    id: "transaction-1",
    title: "واریز",
    icon: ReciveWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
  {
    id: "transaction-2",
    title: "برداشت",
    icon: SendWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
  {
    id: "transaction-3",
    title: "برداشت",
    icon: SendWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
  {
    id: "transaction-4",
    title: "برداشت",
    icon: SendWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
  {
    id: "transaction-5",
    title: "برداشت",
    icon: SendWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
  {
    id: "transaction-6",
    title: "برداشت",
    icon: SendWalletIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
  },
];

