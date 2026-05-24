import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";

const VideoSection = () => {
  return (
    <ContentWrapper>
      <div className="w-full max-w-[1214px] aspect-[1214/683] rounded-[200px] md:rounded-[400px] mx-auto relative overflow-hidden">
        <video
          src="/video/adds.mp4"
          poster="/video/cover.svg"
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(81,27,221,0.10)_0%,rgba(81,27,221,0.10)_100%),linear-gradient(180deg,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.70)_100%)]"></div>
        <p className="absolute bottom-[10%] md:bottom-[219px] left-1/2 -translate-x-1/2 md:left-[163px] md:translate-x-0 px-4 md:px-0  title-md-regular md:title-md-bold text-center text-[16px] w-full md:w-auto">
          فرمانی به سرعت صوت <br /> پاسخی به هوشمندی آریو
        </p>
      </div>
    </ContentWrapper>
  );
};

export default VideoSection;
