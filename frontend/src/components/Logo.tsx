"use client";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 60, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer square border */}
      <rect x="8" y="8" width="84" height="84" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      {/* Inner square border */}
      <rect x="14" y="14" width="72" height="72" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.5" />

      {/* L character */}
      <text
        x="18"
        y="68"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="52"
        fontWeight="300"
        fill="#C9A84C"
        letterSpacing="-2"
      >
        L
      </text>

      {/* P character */}
      <text
        x="50"
        y="68"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="52"
        fontWeight="300"
        fill="#C9A84C"
        letterSpacing="-2"
      >
        P
      </text>
    </svg>
  );
}
