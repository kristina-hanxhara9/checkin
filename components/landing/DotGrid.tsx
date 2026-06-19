interface Props {
  className?: string;
  /** Fade mask from full-opacity centre out to transparent edges. */
  fade?: boolean;
}

export function DotGrid({ className = "", fade = true }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 dot-grid ${className}`}
      style={{
        maskImage: fade
          ? "radial-gradient(ellipse 60% 50% at 50% 50%, black 40%, transparent 80%)"
          : undefined,
        WebkitMaskImage: fade
          ? "radial-gradient(ellipse 60% 50% at 50% 50%, black 40%, transparent 80%)"
          : undefined,
      }}
    />
  );
}
