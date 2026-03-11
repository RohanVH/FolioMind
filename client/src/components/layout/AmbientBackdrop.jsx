export const AmbientBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div
      className="floating-orb left-[-140px] top-[120px] h-72 w-72"
      style={{ backgroundColor: "color-mix(in srgb, var(--primary) 32%, transparent)" }}
    />
    <div
      className="floating-orb right-[-120px] top-[260px] h-80 w-80"
      style={{
        backgroundColor: "color-mix(in srgb, var(--accent) 28%, transparent)",
        animationDelay: "2s"
      }}
    />
    <div
      className="floating-orb bottom-[-140px] left-[35%] h-72 w-72"
      style={{
        backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
        animationDelay: "1s"
      }}
    />
    <div className="mesh-overlay" />
  </div>
);

