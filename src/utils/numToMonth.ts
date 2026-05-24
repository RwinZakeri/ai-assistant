const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function getSolarMonthName(monthNumber: number) {
  if (monthNumber < 1 || monthNumber > 12) {
    return null;
  }

  return months[monthNumber - 1] || null;
}

export default getSolarMonthName;
