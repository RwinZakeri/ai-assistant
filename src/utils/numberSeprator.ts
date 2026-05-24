const numberSeprator = (number: string) => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};
export default numberSeprator;
