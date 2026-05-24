import type { DeliveringHourItem } from '@/apis';
import { formatNumberWithCommas } from '@/components/pages/user-dashboard/delivery/utils';
import { formatDate } from '@/utils/formatDate';

const DeliveryTimeItem = ({
  isActive,
  data,
  onClick,
}: {
  isActive?: boolean;
  data?: DeliveringHourItem;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`bg-[#101010] max-w-[162px] border border-solid ${isActive ? 'border-white' : 'border-transparent cursor-pointer'} flex flex-col justify-between gap-4 items-end p-4 rounded-2xl w-full`}
      data-node-id="20:10233"
      onClick={onClick}
    >
      <div
        className="flex flex-col gap-1 items-start w-full"
        data-node-id="20:10234"
      >
        <p
          className="font-pelak font-bold text-[#fcfcfd] text-[13px] leading-6 w-full text-right"
          data-node-id="20:10235"
          dir="auto"
        >
          {data?.day} {formatDate(data?.date as string, true)}
        </p>
        <p
          className="font-pelak text-[#94969c] text-[16px] leading-6 w-full text-right"
          data-node-id="23:34460"
          dir="auto"
        >
          {data?.startHour} الی {data?.endHour}
        </p>
      </div>
      <div
        className="bg-[#353535] flex items-center justify-center px-5 py-4 rounded-lg w-full"
        data-node-id="20:10237"
      >
        <p
          className="font-pelak font-bold text-[#fcfcfd] text-[14px] leading-6 text-right"
          data-node-id="20:10238"
          dir="auto"
        >
          {`${formatNumberWithCommas(data?.price)} تومان`}{' '}
        </p>
      </div>
    </div>
  );
};

export default DeliveryTimeItem;
