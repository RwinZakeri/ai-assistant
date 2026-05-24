const BinaryToMb = (imageSize: number): string => {
  return (imageSize / (1024 * 1024)).toFixed(2);
};
export default BinaryToMb;
