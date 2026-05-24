"use client";

import { TextInput } from "@/components/ui/input/text-input";
import { TextAreaField } from "@/components/ui/input/textarea-input";
import { Button } from "@/components/ui/button";
import FormFieldGroup from "./FormFieldGroup";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { AccountDetailsFormValues } from "../schemas";
import type { FieldErrors } from "react-hook-form";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
  ssr: false,
});

interface AccountFormFieldsProps {
  errors: FieldErrors<AccountDetailsFormValues>;
  registerField: <T extends keyof AccountDetailsFormValues>(
    fieldName: T
  ) => any;
  onLocationChange?: (lat: number, lng: number) => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

const AccountFormFields: React.FC<AccountFormFieldsProps> = ({
  registerField,
  errors,
  onLocationChange,
  initialLat,
  initialLng,
}) => {
  const handleChange = (lat: number, lng: number) => {
    onLocationChange?.(lat, lng);
  };

  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center gap-5 w-full justify-center mt-12">
        <FormFieldGroup
          label="نام"
          className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <div className="w-[512px] flex flex-row gap-7">
            <TextInput
              placeholder="نام"
              className="w-full"
              inputClassName="text-right"
              error={errors.firstName?.message}
              {...registerField("firstName")}
            />
            <TextInput
              placeholder="نام خانوادگی"
              className="w-full"
              inputClassName="text-right"
              error={errors.lastName?.message}
              {...registerField("lastName")}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup
          label="شماره موبایل"
          className="flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <TextInput
            disabled={true}
            type="number"
            placeholder="شماره موبایل"
            className="w-[512px]"
            inputClassName="w-[512px] text-right"
            error={errors.phone?.message}
            {...registerField("phone")}
          />
        </FormFieldGroup>

        <FormFieldGroup
          label="ایمیل"
          className="flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <TextInput
            placeholder="ایمیل"
            className="w-[512px]"
            inputClassName="w-[512px] text-right"
            error={errors.email?.message}
            {...registerField("email")}
          />
        </FormFieldGroup>

        <FormFieldGroup
          label="آدرس"
          className="flex flex-col justify-center items-center pb-5 gap-7"
        >
          <div className="w-[512px] h-[288px] bg-surfacePrimary rounded-2xl overflow-hidden">
            <MapPicker
              onChange={handleChange}
              initialLat={initialLat}
              initialLng={initialLng}
            />
          </div>
          <Button variant="primary" size="xl" className="w-[512px]">
            ثبت آدرس
          </Button>
        </FormFieldGroup>

        <FormFieldGroup
          label=""
          className="flex flex-col justify-center items-center border-b border-gray-800 pb-5"
        >
          <div className="w-full flex flex-col justify-center items-center relative gap-7">
            <TextAreaField
              placeholder="نشانی دقیق خود را وارد کنید"
              className="w-[512px]"
              textareaClassName="w-[512px] min-h-[110px] text-right resize-none"
              error={errors.addressLine?.message}
              {...registerField("addressLine")}
            />
            <div className="w-[512px] flex flex-row gap-7">
              <TextInput
                placeholder="پلاک"
                className="w-full"
                inputClassName="text-right"
                error={errors.plaque?.message}
                {...registerField("plaque")}
              />
              <TextInput
                type="number"
                placeholder="واحد"
                className="w-full"
                inputClassName="text-right"
                error={errors.unit?.message}
                {...registerField("unit")}
              />
            </div>
            <TextInput
              type="number"
              placeholder="کد پستی"
              className="w-[512px]"
              inputClassName="w-[512px] text-right"
              error={errors.postalCode?.message}
              {...registerField("postalCode")}
            />
          </div>
        </FormFieldGroup>
      </div>
    </section>
  );
};

export default AccountFormFields;
