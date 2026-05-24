'use client';

import { use } from 'react';
import EditDiscountCodePage from '@/components/pages/user-dashboard/discount-codes/edit/[id]';

const EditDiscountCodePageRoute = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = use(params);
  return <EditDiscountCodePage params={resolvedParams} />;
};

export default EditDiscountCodePageRoute;
