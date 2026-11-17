export function ProgressRing({
  value,
  size = 112,
  stroke = 8,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`${label}: ${clamped}${sublabel ?? ""}`}>
        <defs>
          <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#713B91" />
            <stop offset="60%" stopColor="#B990DA" />
            <stop offset="100%" stopColor="#C9A6E8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: size * 0.26, lineHeight: 1 }}>
          {value}
          <span style={{ fontSize: size * 0.13 }}>%</span>
        </p>
        <p className="tiny muted mt-1" style={{ fontSize: size * 0.085 }}>
          {label}
        </p>
      </div>
    </div>
  );
}
