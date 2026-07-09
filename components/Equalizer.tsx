"use client";

export default function Equalizer({
  bars = 24,
  className = "",
  barClassName = "w-1.5",
}: {
  bars?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={`flex items-end gap-1 ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`eq-bar h-full ${barClassName}`}
          style={{
            animationDelay: `${(i * 0.09) % 1.1}s`,
            animationDuration: `${0.8 + ((i * 7) % 5) * 0.14}s`,
          }}
        />
      ))}
    </div>
  );
}
