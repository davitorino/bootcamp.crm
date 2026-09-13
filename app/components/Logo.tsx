type LogoProps = {
  className?: string;
  textClassName?: string;
  iconSize?: number;
};

export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* tronco */}
      <rect x="27" y="16" width="10" height="42" rx="5" fill="#C99A3B" />
      {/* braço esquerdo */}
      <rect x="12" y="27" width="17" height="9" rx="4.5" fill="#C99A3B" />
      <rect x="12" y="16" width="9" height="20" rx="4.5" fill="#C99A3B" />
      {/* braço direito */}
      <rect x="35" y="23" width="17" height="9" rx="4.5" fill="#C99A3B" />
      <rect x="43" y="12" width="9" height="20" rx="4.5" fill="#C99A3B" />
      {/* bolinha dourada */}
      <circle cx="47" cy="8" r="5" fill="#E3B94D" />
    </svg>
  );
}

export function Logo({ className = "", textClassName = "", iconSize = 28 }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className={`font-extrabold ${textClassName}`}>
        LSG <span className="font-semibold">Partners</span>
      </span>
    </span>
  );
}
