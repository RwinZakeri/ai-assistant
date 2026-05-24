export const formatPersianDate = (isoDate: string | undefined): string => {
  if (!isoDate) return "-";

  try {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      return "تاریخ نامعتبر";
    }

    try {
      const year = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        calendar: "persian",
      }).format(date);

      const month = new Intl.DateTimeFormat("fa-IR", {
        month: "2-digit",
        calendar: "persian",
      }).format(date);

      const day = new Intl.DateTimeFormat("fa-IR", {
        day: "2-digit",
        calendar: "persian",
      }).format(date);

      const hours = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        hour12: false,
      }).format(date);

      const minutes = new Intl.DateTimeFormat("fa-IR", {
        minute: "2-digit",
      }).format(date);

      return `${year}/${month}/${day} - ${hours}:${minutes}`;
    } catch {
      const fallbackDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

      const [datePart, timePart] = fallbackDate.split(", ");
      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      return `${year}/${month}/${day} - ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "خطا در نمایش تاریخ";
  }
};
