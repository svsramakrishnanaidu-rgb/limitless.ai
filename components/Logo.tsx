import { BRAND } from "@/lib/site";

/**
 * Original LIMITLESS mark: two interlocking open ribbons forming an infinity
 * sign, drawn as vector so it stays crisp at any size and needs no image
 * request. Metallic lavender and white, matching the interface.
 */
export function LogoMark({ size = 40, withRim = false }: { size?: number; withRim?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="LIMITLESS infinity mark"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="ll-metal" x1="6" y1="14" x2="58" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#E7D4F0" />
          <stop offset="1" stopColor="#B990DA" />
        </linearGradient>
        <linearGradient id="ll-violet" x1="10" y1="46" x2="54" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#713B91" />
          <stop offset="0.55" stopColor="#B990DA" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      {withRim && (
        <circle cx="32" cy="32" r="30" fill="none" stroke="url(#ll-metal)" strokeOpacity="0.35" strokeWidth="0.9" />
      )}
      <path
        d="M32 32c-6.6-8.6-11.2-12.6-16.4-12.6-5.9 0-10.4 5.1-10.4 12.6s4.5 12.6 10.4 12.6c5.6 0 10.6-4.7 16.4-12.6Z"
        fill="none"
        stroke="url(#ll-metal)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M32 32c6.6 8.6 11.2 12.6 16.4 12.6 5.9 0 10.4-5.1 10.4-12.6s-4.5-12.6-10.4-12.6C42.8 19.4 37.8 24.1 32 32Z"
        fill="none"
        stroke="url(#ll-violet)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M32 32c3.1-3.6 6.4-6 10-7"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="display"
        style={{
          fontSize: compact ? "1rem" : "1.32rem",
          letterSpacing: compact ? "0.14em" : "0.16em",
          color: "var(--text)",
        }}
      >
        {BRAND.name}
      </span>
      {!compact && (
        <span
          className="mt-1.5 text-[0.56rem] uppercase"
          style={{ color: "var(--muted)", letterSpacing: "0.24em" }}
        >
          Beyond Boundaries
        </span>
      )}
    </span>
  );
}
