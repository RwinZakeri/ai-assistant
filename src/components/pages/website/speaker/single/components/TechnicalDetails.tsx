import { TechnicalDetail } from "../type";

const TechnicalDetails = ({ details }: { details: TechnicalDetail[] }) => (
  <div className="flex flex-col gap-5">
    <h3 className="title-md-demibold text-gray-25">مشخصات</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-[98px]">
      {details.map((detail, index) => (
        <div
          key={index}
          className="flex justify-between py-4 border-b border-linePrimary"
        >
          <span className="text-xl-demibold text-textSecondary">
            {detail.title}
          </span>
          <span className="text-xl-bold text-gray-25">{detail.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TechnicalDetails;
