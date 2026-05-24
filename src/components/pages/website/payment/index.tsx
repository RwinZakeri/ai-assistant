'use client';

import type { DeliveringHourItem } from '@/apis';
import { UserDashboardService } from '@/apis';
import ContentWrapper from '@/components/layouts/wrappers/ContentWrapper';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import { Skeleton } from '@/components/ui/skeleton';
import ReactQuery from '@/configs/react_query_keys';
import { useAppSelector } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import Address from './components/address';
import DeliveryTime from './components/delivery-time';
import FormSection from './components/FormSection';
import Invoice from './components/Invoice';
import PaymentMethod from './components/payment-method';

const Payment = () => {
  const [addressEditMode, setAddressEditMode] = React.useState(false);
  const [discountcode, setDiscountcode] = React.useState('');
  const [selectedDeliveryTime, setSelectedDeliveryTime] =
    React.useState<DeliveringHourItem | null>(null);
  const [payWithWallet, setPayWithWallet] = React.useState<boolean>(false);
  const [discountedPrice, setDiscountedPrice] = React.useState<number | null>(
    null,
  );

  const { data: profileData } = useAppSelector(state => state.userProfile);

  const params = useParams();
  const queryParams = useSearchParams();
  const orderId = Number(params.id);
  const orderType = queryParams.get('orderType');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQuery.orderDetail, orderId],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetorderdetailtopayGet(
        orderId,
      ),
    enabled: (orderId as number) > 0,
  });

  const applayDiscount = useMutation({
    mutationFn: async (discountcode: string) => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardCheckdiscountGet(
          discountcode,
          orderId,
        );
      return res;
    },
    onSuccess: data => {
      if (data.isValid) {
        setDiscountedPrice(data.totalPayableAfterDiscount as number);
        toast.success('کد تخفیف با موفقیت اعمال شد');
      } else {
        toast.error(data?.message || 'کد تخفیف نامعتبر است');
      }
    },
  });

  const withWallet = useMutation({
    mutationFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardPayorderwithwalletPost(
          { deliveringHourId: selectedDeliveryTime?.id, orderId },
        );
      return res;
    },
    onSuccess: data => {
      router.push(
        `/payment/callback?success=${data?.paid ? '1' : '0'}&orderId=${orderId}&trackId=${data?.trackId}`,
      );
    },
  });

  const withZibal = useMutation({
    mutationFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardStartzibalpaymentPost(
          { deliveringHourId: selectedDeliveryTime?.id, orderId },
        );
      return res;
    },
    onSuccess: data => {
      window.location.href = data.startUrl as string;
    },
    onError: () => {
      toast.error('خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.');
    },
  });

  const handleDiscount = () => {
    applayDiscount.mutate(discountcode);
  };

  const checkWalletBalance = () => {
    if (discountedPrice) {
      if (
        (data?.availableWalletBalance as number) <
        discountedPrice + (selectedDeliveryTime?.price || 0)
      ) {
        toast.error('موجودی کیف پول کافی نمی‌باشد');
        return;
      } else {
        withWallet.mutate();
      }
    } else {
      if (
        (data?.availableWalletBalance as number) <
        (data?.productPrice as number) + (selectedDeliveryTime?.price || 0)
      ) {
        toast.error('موجودی کیف پول کافی نمی‌باشد');
        return;
      } else {
        withWallet.mutate();
      }
    }
  };

  if (addressEditMode && !isLoading) {
    return (
      <ContentWrapper>
        <FormSection require title="آدرس">
          <Address
            addressEditMode={addressEditMode}
            setAddressEditMode={setAddressEditMode}
          />
        </FormSection>
      </ContentWrapper>
    );
  }

  if (isLoading) {
    return (
      <ContentWrapper>
        {orderType !== 'assistant' && (
          <FormSection require title="آدرس">
            <Skeleton className="h-16 w-full max-w-[512px] mb-4" />
          </FormSection>
        )}
        <FormSection require title="انتخاب زمان ارسال">
          <Skeleton className="h-16 w-full max-w-[512px] mb-4" />
        </FormSection>
        <FormSection title="انتخاب روش پرداخت">
          <Skeleton className="h-12 w-full max-w-[512px] mb-4" />
        </FormSection>
        <FormSection title="کد تخفیف">
          <div className="flex max-w-[512px] gap-2 items-center">
            <Skeleton className="h-10 w-full flex-1 rounded-r-md" />
            <Skeleton className="h-10 w-32 rounded-l-md" />
          </div>
        </FormSection>
        <div className="max-w-[512px] w-full mt-4">
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-14 w-40 mt-5" />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      {orderType !== 'assistant' && (
        <FormSection require title="آدرس">
          <Address
            addressEditMode={addressEditMode}
            setAddressEditMode={setAddressEditMode}
            userEnteredAddress={data?.userEnteredAddress}
          />
        </FormSection>
      )}
      {orderType !== 'assistant' && (
        <FormSection require title="انتخاب زمان ارسال">
          <DeliveryTime
            data={data?.availableDeliveringHours}
            onClick={item => setSelectedDeliveryTime(item)}
          />
        </FormSection>
      )}
      <FormSection title="انتخاب روش پرداخت">
        <PaymentMethod
          wallet={data?.availableWalletBalance}
          onChange={() => setPayWithWallet(e => !e)}
        />
      </FormSection>
      <FormSection title="کد تخفیف">
        <div className="flex max-w-[512px] gap-2 items-center">
          <TextInput
            aria-label="کد تخفیف"
            className="flex-1 rounded-r-md"
            placeholder="کد تخفیف"
            value={discountcode}
            onChange={e => setDiscountcode(e.target.value)}
          />
          <Button
            className="rounded-l-md"
            disabled={applayDiscount.isPending}
            loading={applayDiscount.isPending}
            type="button"
            onClick={handleDiscount}
          >
            اعمال کد تخفیف
          </Button>
        </div>
      </FormSection>
      <Invoice
        delivery={selectedDeliveryTime?.price}
        discountedPrice={discountedPrice as number}
        price={data?.productPrice as number}
        isAssistant={orderType === 'assistant'}
      />
      <Button
        className="mt-5"
        disabled={
          orderType !== 'assistant'
            ? !selectedDeliveryTime || !profileData?.fullAddress
            : false
        }
        loading={withWallet.isPending || withZibal.isPending}
        size="xl"
        onClick={() => {
          if (payWithWallet) {
            checkWalletBalance();
          } else {
            withZibal.mutate();
          }
        }}
      >
        پرداخت
      </Button>
    </ContentWrapper>
  );
};

export default Payment;
