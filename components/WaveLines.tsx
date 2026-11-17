export function WaveLines({
  className = "",
  opacity = 0.5,
  tone = "violet",
}: {
  className?: string;
  opacity?: number;
  tone?: "violet" | "burgundy";
}) {
  const a = tone === "burgundy" ? "#d85a80" : "#c9a6e8";
  const b = tone === "burgundy" ? "#981e42" : "#713b91";

  return (
    <svg
      className={`wave-lines ${className}`}
      viewBox="0 0 400 260"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`wave-a-${tone}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={a} stopOpacity="0" />
          <stop offset="0.45" stopColor={a} stopOpacity="0.85" />
          <stop offset="1" stopColor={b} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`wave-b-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={b} stopOpacity="0" />
          <stop offset="0.5" stopColor={a} stopOpacity="0.55" />
          <stop offset="1" stopColor={a} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#wave-a-${tone})`} strokeWidth="1">
        {[0, 14, 28, 44, 62].map((offset, i) => (
          <path
            key={offset}
            d={`M-40 ${120 + offset} C 70 ${40 + offset}, 150 ${190 + offset}, 250 ${120 + offset} S 390 ${70 + offset}, 450 ${130 + offset}`}
            opacity={0.65 - i * 0.09}
          />
        ))}
      </g>
      <g fill="none" stroke={`url(#wave-b-${tone})`} strokeWidth="0.75">
        {[0, 26, 52].map((offset, i) => (
          <path
            key={offset}
            d={`M-40 ${60 + offset} C 90 ${150 + offset}, 180 ${20 + offset}, 280 ${100 + offset} S 400 ${40 + offset}, 460 ${90 + offset}`}
            opacity={0.5 - i * 0.12}
          />
        ))}
      </g>
    </svg>
  );
}
