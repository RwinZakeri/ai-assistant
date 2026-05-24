import Image from "next/image";

const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={506}
    height={506}
    className="rounded-[16px] object-cover"
    priority
  />
);

export default ProductImage;