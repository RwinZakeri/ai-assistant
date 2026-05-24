import type { SingleUserRecordOutput } from "@/apis/models/SingleUserRecordOutput";
import type { User, SupportTicket } from "./components/types";
import {
  ResponseSpeed,
  type ResponseSpeedType,
  TicketStatus,
} from "@/enums/enum";
import type {
  TicketStatus as ApiTicketStatus,
  GetSelectedUserTicketsOutput,
} from "@/apis";
import { formatDate } from "@/utils/formatDate";

export const mapApiUserToUser = (apiUser: SingleUserRecordOutput): User => {
  return {
    rowNumber: apiUser.rowNumber ?? 0,
    userId: apiUser.userId ?? 0,
    fullname: apiUser.fullname ?? "",
    emailAddress: apiUser.emailAddress ?? "",
    phoneNumber: apiUser.phoneNumber ?? "",
    roleName: apiUser.roleName ?? "",
  };
};

export const parseUserId = (userId: string | undefined): number | undefined => {
  if (!userId) return undefined;
  const parsed = parseInt(userId, 10);
  return isNaN(parsed) ? undefined : parsed;
};

export const parseUserIdWithFallback = (
  userId: string | undefined,
  fallback: number = 0
): number => {
  const parsed = parseUserId(userId);
  return parsed ?? fallback;
};

export const calculateTotalPages = (
  totalItems: number,
  pageSize: number
): number => {
  return Math.ceil(totalItems / pageSize);
};

export const formatBalance = (balance: number): string => {
  return balance.toLocaleString("fa-IR");
};

export const getResponseSpeedValue = (speed?: ResponseSpeedType): string => {
  if (speed === ResponseSpeed.Kardo) return "quick";
  if (speed === ResponseSpeed.Langourously) return "deliberate";
  return "deliberate";
};

export const getResponseSpeedFromValue = (value: string): ResponseSpeedType => {
  if (value === "quick") return ResponseSpeed.Kardo;
  if (value === "deliberate") return ResponseSpeed.Langourously;
  return ResponseSpeed.Default;
};

export const mapTicketStatus = (status?: ApiTicketStatus): TicketStatus => {
  if (status === (1 as ApiTicketStatus)) return TicketStatus.Checking;
  if (status === (2 as ApiTicketStatus)) return TicketStatus.Done;
  return TicketStatus.Pending;
};

export const convertToSupportTicket = (
  ticket: GetSelectedUserTicketsOutput,
  index: number
): SupportTicket => {
  return {
    id: ticket.chatId || String(index),
    ticketNumber: String(ticket.rowNumber ?? index + 1),
    account: ticket.accountName || "",
    title: ticket.title || "",
    subject: ticket.category || "",
    date: formatDate(ticket.date),
    status: mapTicketStatus(ticket.ticketStatus),
  };
};
