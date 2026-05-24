'use client';

import { UserDashboardService } from '@/apis';
import ContentWrapper from '@/components/layouts/wrappers/ContentWrapper';
import { Button } from '@/components/ui/button/index';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentResult = () => {
  const queryParams = useSearchParams();
  const trackId = queryParams.get('trackId');
  const orderId = queryParams.get('orderId');
  const router = useRouter();

  const { data: paymentResult } = useQuery({
    queryKey: ['payment-result', orderId],
    queryFn: async () =>
      UserDashboardService.apiServicesAppUserdashboardGetorderdetailbyidGet(
        Number(orderId),
      ),
    enabled: !!orderId,
  });

  return (
    <ContentWrapper>
      <div className="p-24">
        <div className="flex flex-col gap-5 py-4">
          <Image
            alt="پرداخت موفق"
            height={112}
            src={
              paymentResult?.orderState == 2
                ? '/images/tick-circle.svg'
                : '/images/x-circle.png'
            }
            width={112}
          />
          <p className="text-lg-demibold">
            {paymentResult?.orderState == 2
              ? 'پرداخت شما موفقیت آمیز بود.'
              : 'پرداخت شما ناموفق بود.'}
          </p>
        </div>
        <div className="flex flex-col gap-5 py-5 border-t border-b border-gray-800 mb-8">
          <div className="grid grid-cols-5 gap-8 border-b border-gray-800 pb-4">
            <span className="text-sm-medium text-textSecondary ">
              شماره تراکنش:
            </span>
            <span className="text-sm-medium text-gray-25 ">{trackId}</span>
          </div>
          <div className="grid grid-cols-5 gap-8">
            <span className="text-sm-medium text-textSecondary ">تاریخ:</span>
            <span className="text-sm-medium text-gray-25 ">
              {new Date().toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
        {paymentResult?.orderState == 2 ? (
          <Button onClick={() => router.push('/dashboard')}>
            ورود به حساب کاربری
          </Button>
        ) : (
          <Button onClick={() => router.push('/payment/' + orderId)}>
            تلاش مجدد
          </Button>
        )}
      </div>
    </ContentWrapper>
  );
};

export default PaymentResult;
