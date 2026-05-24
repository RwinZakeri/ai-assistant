export function numberToPersianText(num: number): string {
  if (num === 0) return "صفر";

  const ones = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];

  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];

  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];

  const thousands = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  const numStr = num.toString();
  const groups: string[] = [];
  for (let i = numStr.length; i > 0; i -= 3) {
    groups.unshift(numStr.substring(Math.max(0, i - 3), i));
  }

  const threeDigitToWords = (n: number): string => {
    if (n === 0) return "";

    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const one = n % 10;

    let result = "";
    if (hundred > 0) result += hundreds[hundred];

    const twoDigit = n % 100;
    if (twoDigit > 0) {
      if (result) result += " و ";
      if (twoDigit < 20) result += ones[twoDigit];
      else {
        result += tens[ten];
        if (one > 0) result += " و " + ones[one];
      }
    }

    return result;
  };

  const resultParts: string[] = [];
  groups.forEach((group, i) => {
    const n = parseInt(group);
    if (n === 0) return;
    const groupText = threeDigitToWords(n);
    const unit = thousands[groups.length - i - 1];
    resultParts.push(groupText + (unit ? " " + unit : ""));
  });

  return resultParts.join(" و ").trim();
}

export function rialToTomanText(rial: number): string {
  if (!rial || rial <= 0) return "";
  const toman = Math.floor(rial / 10);
  return numberToPersianText(toman) + " تومان";
}
