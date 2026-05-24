"use client";

import { useEffect, useState } from "react";

const useDevice = () => {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      setDevice(isMobile ? "mobile" : "desktop");
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return device;
};

export default useDevice;
