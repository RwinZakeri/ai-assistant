const SectionsHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center">
      <p className="title-md-demibold text-gray-25 text-center">{title}</p>
      <p className="text-xl-regular text-textSecondary text-center">
        {description}
      </p>
    </div>
  );
};

export default SectionsHeader;
