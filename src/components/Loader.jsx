import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = ({ size = 200, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <DotLottieReact
          src="https://lottie.host/5d3d716e-d632-4e45-a0e6-24d0aeafcad6/MoegufaslF.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Loader;
