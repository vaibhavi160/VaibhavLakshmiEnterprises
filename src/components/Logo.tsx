import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightMode?: boolean;
}

/**
 * Exact Vector recreation of the Maa Vaibhavi Lakshmi logo emblem:
 * - Sacred Gold OM (ॐ) floating above the house apex
 * - Geometric Gable House with double-line roof structure and vertical walls
 * - Symmetrical Blooming Sacred Lotus rooted seamlessly at the baseline
 */
export const LogoEmblem: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 300 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Double Concentric Gold Arch Rings */}
    <path
      d="M 38 230 A 118 118 0 0 1 262 230"
      stroke="#C59B27"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 52 230 A 104 104 0 0 1 248 230"
      stroke="#C59B27"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Architectural 5-House Skyline */}
    {/* 1. Center Tall Gable House */}
    <path
      d="M 130 92 L 150 70 L 170 92 V 230 H 130 Z"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="144" y="102" width="12" height="12" rx="1.5" stroke="#134E4A" strokeWidth="2.2" fill="none" />

    {/* 2. Mid Left House */}
    <path
      d="M 98 116 L 120 94 L 130 104 V 230 H 98 Z"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="106" y="126" width="10" height="10" rx="1" stroke="#134E4A" strokeWidth="2" fill="none" />

    {/* 3. Mid Right House */}
    <path
      d="M 170 104 L 180 94 L 202 116 V 230 H 170 Z"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="184" y="126" width="10" height="10" rx="1" stroke="#134E4A" strokeWidth="2" fill="none" />

    {/* 4. Outer Left House */}
    <path
      d="M 72 140 L 90 122 L 98 130 V 230 H 72 Z"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="79" y="150" width="9" height="9" rx="1" stroke="#134E4A" strokeWidth="1.8" fill="none" />

    {/* 5. Outer Right House */}
    <path
      d="M 202 130 L 210 122 L 228 140 V 230 H 202 Z"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect x="212" y="150" width="9" height="9" rx="1" stroke="#134E4A" strokeWidth="1.8" fill="none" />

    {/* Inner Arch Portal Framing */}
    <path
      d="M 98 230 V 170 A 52 52 0 0 1 202 170 V 230"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 108 230 V 176 A 42 42 0 0 1 192 176 V 230"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Bottom Horizontal Base Line */}
    <line x1="60" y1="230" x2="240" y2="230" stroke="#134E4A" strokeWidth="4" strokeLinecap="round" />

    {/* Sacred OM (ॐ) Symbol */}
    <g id="om-symbol">
      <text
        x="150"
        y="152"
        textAnchor="middle"
        fill="#C59B27"
        fontSize="24"
        fontFamily="'Noto Sans Devanagari', 'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
        className="select-none"
      >
        ॐ
      </text>
    </g>

    {/* Sacred Lotus Flower in Portal */}
    <g id="lotus-flower" transform="translate(150, 212)">
      {/* Center Tall Petal */}
      <path
        d="M 0 -30 C -10 -15 -10 4 0 14 C 10 4 10 -15 0 -30 Z"
        stroke="#134E4A"
        strokeWidth="2.6"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner Left Petal */}
      <path
        d="M 0 14 C -12 8 -22 -1 -17 -12 C -9 -8 -4 4 0 14 Z"
        stroke="#134E4A"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner Right Petal */}
      <path
        d="M 0 14 C 12 8 22 -1 17 -12 C 9 -8 4 4 0 14 Z"
        stroke="#134E4A"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Outer Left Wing */}
      <path
        d="M 0 14 C -20 10 -34 2 -29 -6 C -20 -1 -10 8 0 14 Z"
        stroke="#134E4A"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Outer Right Wing */}
      <path
        d="M 0 14 C 20 10 34 2 29 -6 C 20 -1 10 8 0 14 Z"
        stroke="#134E4A"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bottom Base Arch Loop */}
      <path
        d="M -26 16 Q 0 22 26 16"
        stroke="#C59B27"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  </svg>
);

export const MiniLotusIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-4',
  color = '#C59B27',
}) => (
  <svg viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center petal */}
    <path d="M 27 2 C 20 12 20 26 27 34 C 34 26 34 12 27 2 Z" stroke={color} strokeWidth="2.8" fill="none" />
    {/* Left petal */}
    <path d="M 27 34 C 14 26 4 14 10 4 C 18 8 22 22 27 34 Z" stroke={color} strokeWidth="2.4" fill="none" />
    {/* Right petal */}
    <path d="M 27 34 C 40 26 50 14 44 4 C 36 8 32 22 27 34 Z" stroke={color} strokeWidth="2.4" fill="none" />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
}) => {
  if (variant === 'icon') {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-28 h-28',
    };

    return (
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <LogoEmblem className="w-full h-full" />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Emblem Artwork */}
        <div className="w-36 sm:w-44 md:w-52 h-auto mb-3">
          <LogoEmblem />
        </div>

        {/* Primary Title */}
        <h1 className="font-black text-lg sm:text-2xl md:text-3xl tracking-wider uppercase text-[#134E4A] dark:text-emerald-300 font-sans">
          Maa Vaibhav Lakshmi
        </h1>

        {/* Middle Line with Lotus Flanking */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-1.5">
          <MiniLotusIcon className="w-5 h-4 sm:w-6 sm:h-5" color="#C59B27" />
          <span className="font-black text-sm sm:text-lg md:text-xl tracking-widest uppercase text-[#134E4A] dark:text-white">
            ENTERPRISES
          </span>
          <MiniLotusIcon className="w-5 h-4 sm:w-6 sm:h-5" color="#C59B27" />
        </div>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mt-0.5">
          Building Prosperity • Since 2012
        </p>
      </div>
    );
  }

  // Default 'horizontal' or 'compact' for Headers and Footers
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none shrink-0 ${className}`}>
      {/* Icon Emblem */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-300/60 dark:border-emerald-700/40 p-0.5 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
        <LogoEmblem className="w-full h-full" />
      </div>

      {/* Brand Text Column */}
      <div className="flex flex-col text-left leading-none shrink-0">
        <div className="flex items-center gap-1">
          <span className="font-black text-xs sm:text-sm lg:text-base tracking-tight text-[#134E4A] dark:text-white font-sans uppercase whitespace-nowrap">
            Maa Vaibhav Lakshmi
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 whitespace-nowrap">
          <MiniLotusIcon className="w-2.5 h-2 sm:w-3 sm:h-2.5 shrink-0" color="#C59B27" />
          <span className="font-black text-[9px] sm:text-[10px] tracking-wider uppercase text-amber-700 dark:text-amber-400">
            ENTERPRISES
          </span>
          <span className="text-slate-300 dark:text-slate-600 font-light">•</span>
          <span className="text-[9px] sm:text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold tracking-tight">
            Since 2012
          </span>
        </div>
      </div>
    </div>
  );
};
