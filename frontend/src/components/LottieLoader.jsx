import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LottieLoader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-64 h-64 mx-auto mb-6">
          <DotLottieReact
            src="https://lottie.host/43135bfb-c301-403e-9574-daa9b95e8cf3/95WzO26IrX.lottie"
            loop
            autoplay
            className="w-full h-full"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-light text-gray-900">Loading ReWear</h2>
          <p className="text-sm text-gray-600">
            Preparing your sustainable fashion experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LottieLoader;
