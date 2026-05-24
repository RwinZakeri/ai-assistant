'use client';

export const formatDate = (
  dateString?: string | null,
  justDate?: boolean,
): string => {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const persianTime = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
    if (justDate) {
      return persianDate;
    }
    return `${persianTime} - ${persianDate}`;
  } catch {
    return dateString ?? '';
  }
};
