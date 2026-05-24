/**
 * Converts Persian digits to English digits
 * @param str - String containing Persian or English digits
 * @returns String with all digits converted to English
 */
export function persianToEnglish(str: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";

  return str.replace(/[۰-۹]/g, (char) => {
    const index = persianDigits.indexOf(char);
    return index !== -1 ? englishDigits[index] : char;
  });
}
