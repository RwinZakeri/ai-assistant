import Image from "next/image";

const AuthBackground = () => {
  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden h-screen">
      <Image
        src="/images/loginimage.png"
        alt="Auth Background"
        fill
        className="object-cover scale-120 origin-left"
        style={{
          objectPosition: "left top",
        }}
        quality={100}
        priority
      />
    </div>
  );
};

export default AuthBackground;
