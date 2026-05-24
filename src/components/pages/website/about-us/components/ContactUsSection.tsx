import { PhoneIcon } from "@/assets/images/svg/Phone";
import { MarkerPin02Icon } from "@/assets/images/svg/MarkerPin02";
import { MessageChatIcon } from "@/assets/images/svg/MessageChat";

export default function ContactUsSection() {
  return (
    <section className="w-full md:py-[96px] flex justify-center items-center bg-black">
      <div className="w-full max-w-[1280px] flex flex-col items-center gap-8 md:gap-16">
        <div className="text-center">
          <h2 className="title-md-demibold text-gray-25 mb-3 md:mb-4">
            از شنیدن نظرات و درخواستهای شما خوشحال میشویم
          </h2>
          <p className="text-xl-regular text-textTertiary">
            با تیم پشتیبانی ما در ارتباط باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          <div className="bg-surfacePrimary p-6">
            <div className="flex flex-col gap-16">
              <div className="w-12 h-12 bg-primary-300 rounded-lg flex items-center justify-center">
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl-demibold text-gray-25 ">
                  با ما تماس بگیرید
                </h3>
                <p className="text-md-regular text-textTertiary mt-2">
                  شنبه تا چهارشنبه از ساعت ۸ صبح تا ۵ بعد از ظهر.
                </p>
                <a
                  href="tel:021-66098375"
                  className="text-primary-300 w-fit text-md-demibold mt-5 hover:text-primary-400 transition-colors "
                >
                  ۰۲۱-۶۶۰۹۸۳۷۵
                </a>
              </div>
            </div>
          </div>

          <div className="bg-surfacePrimary p-6">
            <div className="flex flex-col gap-16">
              <div className="w-12 h-12 bg-primary-300 rounded-lg flex items-center justify-center">
                <MarkerPin02Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl-demibold text-gray-25 ">
                  ما را ملاقات کنید
                </h3>
                <p className="text-md-regular text-textTertiary mt-2">
                  به دفتر مرکزی ما مراجعه کنید.
                </p>
                <div className="text-primary-300 text-md-demibold mt-5 ">
                  تهران، طرشت، خیابان شهید بایندریها، پلاک ۸۵، واحد ۷
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surfacePrimary p-6">
            <div className="flex flex-col gap-16">
              <div className="w-12 h-12 bg-primary-300 rounded-lg flex items-center justify-center">
                <MessageChatIcon className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl-demibold text-gray-25 ">چت برای فروش</h3>
                <p className="text-md-regular text-textTertiary mt-2">
                  با تیم دوستانه ما صحبت کنید.
                </p>
                <a
                  href="mailto:info@ArioStore.com"
                  className="inline-block w-fit text-primary-300 text-base md:text-md-demibold mt-5 hover:text-primary-400 transition-colors border-b border-primary-300 hover:border-primary-400 font-semibold"
                >
                  info@ArioStore.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
