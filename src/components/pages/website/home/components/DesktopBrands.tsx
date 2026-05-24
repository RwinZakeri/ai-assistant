import Image from "next/image";
import { Brands } from "./type";

const DesktopBrands = () => {
  return (
    <>
      <div className="hidden md:flex flex-wrap w-full items-center justify-between px-8 gap-8">
        {Brands.map((brand, index) => (
          <Image
            key={index}
            src={brand.src}
            alt={brand.alt}
            width={brand.width}
            height={brand.height}
          />
        ))}
      </div>
    </>
  );
};

export default DesktopBrands;
