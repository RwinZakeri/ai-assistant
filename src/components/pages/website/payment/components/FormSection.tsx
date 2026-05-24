const FormSection = ({
  children,
  require,
  title,
}: {
  children: React.ReactNode;
  require?: boolean;
  title: string;
}) => {
  return (
    <div className="py-5 border-b-1 border-gray-800">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 ">
          <p
            className={
              "text-sm-medium text-textSecondary " +
              (require
                ? "after:content-['*'] after:mr-0.5 after:text-red-500"
                : "")
            }
          >
            {title}
          </p>
        </div>
        <div className="col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default FormSection;
