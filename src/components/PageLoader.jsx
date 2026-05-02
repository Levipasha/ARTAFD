import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PencilLoader = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    className="animate-spin-slow"
    style={{ width: "100%", height: "100%" }}
  >
    <defs>
      <clipPath id="page-pencil-eraser">
        <rect height="30" width="30" ry="5" rx="5" />
      </clipPath>
    </defs>

    {/* Outer stroke */}
    <circle
      transform="rotate(-113,100,100)"
      strokeLinecap="round"
      strokeDashoffset="439.82"
      strokeDasharray="439.82 439.82"
      strokeWidth="2"
      stroke="red"
      fill="none"
      r="70"
    />

    <g transform="translate(100,100)">
      {/* Pencil Body */}
      <g fill="none">
        <circle
          transform="rotate(-90)"
          strokeDashoffset="402"
          strokeDasharray="402.12 402.12"
          strokeWidth="30"
          stroke="#ff1a1a"
          r="64"
        />
        <circle
          transform="rotate(-90)"
          strokeDashoffset="465"
          strokeDasharray="464.96 464.96"
          strokeWidth="10"
          stroke="#ff4d4d"
          r="74"
        />
        <circle
          transform="rotate(-90)"
          strokeDashoffset="339"
          strokeDasharray="339.29 339.29"
          strokeWidth="10"
          stroke="#cc0000"
          r="54"
        />
      </g>

      {/* Eraser */}
      <g transform="rotate(-90) translate(49,0)">
        <g>
          <rect height="30" width="30" ry="5" rx="5" fill="#ff6666" />
          <rect
            clipPath="url(#page-pencil-eraser)"
            height="30"
            width="5"
            fill="#cc0000"
          />
          <rect height="20" width="30" fill="#f2f2f2" />
          <rect height="20" width="15" fill="#cccccc" />
        </g>
      </g>

      {/* Pencil Tip */}
      <g transform="rotate(-90) translate(49,-30)">
        <polygon points="15 0,30 30,0 30" fill="#ff9999" />
        <polygon points="15 0,6 30,0 30" fill="#cc3333" />
        <polygon points="15 0,20 10,10 10" fill="black" />
      </g>
    </g>
    <style>{`
      .animate-spin-slow {
        animation: spin-slow 4s linear infinite;
      }
      @keyframes spin-slow {
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </svg>
);

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64">
              <PencilLoader />
            </div>
            <div className="mt-8 text-center font-black tracking-tighter text-5xl md:text-6xl">
              <span className="text-white">Art</span>
              <span className="text-red-600">Artist</span>
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};


export default PageLoader;
