import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogoIcon({ size = 34 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-sm border border-sky-300/40 group-hover:scale-105 transition-transform"
    >
      <svg
        width={Math.round(size * 0.65)}
        height={Math.round(size * 0.65)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
  );
}

export default function BrandLogo({
  size = "md",
  showText = true,
  href,
  className = "",
}: BrandLogoProps) {
  const iconSizes = {
    sm: 26,
    md: 34,
    lg: 42,
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const content = (
    <div className={`group inline-flex items-center gap-2 min-w-0 ${className}`}>
      <BrandLogoIcon size={iconSizes[size]} />
      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className={`font-extrabold tracking-tight text-foreground truncate ${textSizes[size]}`}>
            Doc<span className="text-primary">Pulse</span>
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-muted-foreground -mt-0.5 truncate">
            Doctor Tracker
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
