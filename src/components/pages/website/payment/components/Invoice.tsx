import { formatNumberWithCommas } from '@/components/pages/user-dashboard/delivery/utils';

const Invoice = ({
  price,
  delivery,
  discountedPrice,
  isAssistant,
}: {
  price: number;
  delivery?: number;
  discountedPrice?: number;
  isAssistant?: boolean;
}) => {
  return (
    <div className="py-5 border-b-1 border-gray-800 flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 ">
          <p className="text-sm-medium text-textSecondary ">قیمت کالا</p>
        </div>
        <div className="col-span-3">
          <p
            className={`text-gray-25 text-md-medium ${discountedPrice ? 'line-through' : ''}`}
          >
            {formatNumberWithCommas(price)} تومان
          </p>
        </div>
      </div>
      {discountedPrice && (
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 ">
            <p className="text-sm-medium text-textSecondary ">بعد از تخفیف</p>
          </div>
          <div className="col-span-3">
            <p className="text-gray-25 text-md-medium">
              {formatNumberWithCommas(discountedPrice)} تومان
            </p>
          </div>
        </div>
      )}
      {!isAssistant && (
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 ">
            <p className="text-sm-medium text-textSecondary ">هزینه ارسال</p>
          </div>
          <div className="col-span-3">
            <p className="text-gray-25 text-md-medium">
              {delivery ? formatNumberWithCommas(delivery) + ' تومان' : '-'}
            </p>
          </div>
        </div>
      )}
      <div className="w-full h-[1px]  bg-gray-800" />
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 ">
          <p className="text-sm-medium text-textSecondary ">مبلغ قابل پرداخت</p>
        </div>
        <div className="col-span-3">
          <p className="text-gray-25  text-md-bold">
            {formatNumberWithCommas(price + (delivery || 0))} تومان
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
