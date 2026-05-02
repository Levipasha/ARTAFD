import React from "react";
import { cn } from "../lib/utils";

const Loader = ({ size = 200, className = "", dark = false }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)} style={{ width: size }}>
      <div style={{ width: size, height: size }}>
        {/* ... SVG content ... */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="animate-spin-slow"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <clipPath id="pencil-eraser-new">
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
                  clipPath="url(#pencil-eraser-new)"
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
        </svg>
      </div>

      <div className="mt-4 text-center font-black tracking-tighter" style={{ fontSize: size * 0.15 }}>
        <span className={dark ? "text-white" : "text-black"}>Art</span>
        <span className="text-red-600">Artist</span>
      </div>

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
    </div>
  );
};

export default Loader;

