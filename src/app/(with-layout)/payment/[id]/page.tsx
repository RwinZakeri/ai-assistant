import Payment from '@/components/pages/website/payment';
import { Suspense } from 'react';

const pagePaymentById = () => {
  return (
    <Suspense>
      <Payment />
    </Suspense>
  );
};

export default pagePaymentById;
