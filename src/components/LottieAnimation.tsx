"use client";

import Lottie from "react-lottie";
import animationData from "@/json/shuttlecock.json";
import { ReactNode } from "react";

interface LottieAnimationProps {
  children?: ReactNode;
}

const LottieAnimation = ({ children }: LottieAnimationProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Lottie options={defaultOptions} height={200} width={200} />
      {children}
    </div>
  );
};

export default LottieAnimation;
