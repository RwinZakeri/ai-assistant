import Image from "next/image";
import type { FeatureSlideProps } from "./type";

const FeatureSlide = ({
  imageSrc,
  imageAlt,
  title,
  description,
  showOverlay = false,
}: FeatureSlideProps) => {
  const hasContent = Boolean(title && description);

  return (
    <div className="relative w-full aspect-square">
      <Image
        src={imageSrc}
        alt={imageAlt}
        className="rounded-4xl object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {showOverlay && (
        <div className="absolute inset-0 rounded-4xl bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}
      {hasContent && (
        <div className="absolute bottom-11 right-6 z-10 flex max-w-[384px] flex-col gap-3 text-center">
          <p className="title-xs-demibold text-gray-25">{title}</p>
          <p className="text-xs-regular text-textSecondary">{description}</p>
        </div>
      )}
    </div>
  );
};

export default FeatureSlide;
