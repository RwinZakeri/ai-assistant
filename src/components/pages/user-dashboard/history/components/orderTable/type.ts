import { NetworkIcon } from "@/assets/images/svg/Network";
import { SpeakerIcon } from "@/assets/images/svg/Speaker";
import { ComponentType } from "react";

export type OrderRowBadgeVariant =
  | "gray"
  | "primary"
  | "sale"
  | "warning"
  | "success"
  | "error";

export interface OrderHistoryRow {
  id: string;
  title: string;
  icon: ComponentType;
  amount: string;
  date: string;
  badgeLabel: string;
  badgeVariant: OrderRowBadgeVariant;
  detailHref: string;
}

export const orderHistoryRows: OrderHistoryRow[] = [
  {
    id: "order-1",
    title: "دستیار صوتی",
    icon: NetworkIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
    badgeLabel: "زبان",
    badgeVariant: "primary",
    detailHref: "/dashboard/history/1",
  },
  {
    id: "order-2",
    title: "دستیار صوتی",
    icon: SpeakerIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
    badgeLabel: "در حال ارسال",
    badgeVariant: "warning",
    detailHref: "/dashboard/history/1",
  },
  {
    id: "order-3",
    title: "دستیار صوتی",
    icon: NetworkIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
    badgeLabel: "ورزشی",
    badgeVariant: "primary",
    detailHref: "/dashboard/history/1",
  },
  {
    id: "order-4",
    title: "دستیار صوتی",
    icon: NetworkIcon,
    amount: "500,000,000 ریال",
    date: "1402/06/10 - 14:50",
    badgeLabel: "زبان",
    badgeVariant: "primary",
    detailHref: "/dashboard/history/1",
  },
];
