"use client";

import { useState } from "react";
import Login from "./components/login";
import OTP from "./components/otp";
import Password from "./components/password";
import Register from "./components/register";


type AuthStep = "login" | "otp" | "password" | "register";

const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>("login");
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <>
      {step === "login" && (
        <Login
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          setStep={setStep}
        />
      )}
      {step === "otp" && <OTP mobileNumber={mobileNumber} setStep={setStep} />}
      {step === "password" && (
        <Password mobileNumber={mobileNumber} setStep={setStep} />
      )}
      {step === "register" && (
        <Register mobileNumber={mobileNumber} setStep={setStep} />
      )}
    </>
  );
};

export default AuthPage;
