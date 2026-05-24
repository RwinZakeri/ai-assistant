import PaymentResult from '@/components/pages/website/payment/components/PaymentResult';
import { Suspense } from 'react';

const PaymentCallback = () => {
  return (
    <Suspense>
      <PaymentResult />
    </Suspense>
  );
};

export default PaymentCallback;
