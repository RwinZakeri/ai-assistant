const ToPersainNumber = (number: number | undefined) => {
  if (!number) return "0";
  return number.toLocaleString("fa-IR");
};

export default ToPersainNumber;
