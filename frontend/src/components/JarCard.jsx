export default function JarCard({ label, selected, onClick, onDelete, seed }) {
  const palette = ["#6F8A5B", "#4F6D4E", "#6A7BA2", "#C2A57A", "#8E684E"];

  function hashToIndex(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return Math.abs(h) % palette.length;
  }

  function lighten(hex, amt = 0.2) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.min(255, Math.round(r + (255 - r) * amt));
    g = Math.min(255, Math.round(g + (255 - g) * amt));
    b = Math.min(255, Math.round(b + (255 - b) * amt));
    return `rgb(${r}, ${g}, ${b})`;
  }

  const base = palette[hashToIndex(seed || label)];
  const lid = lighten(base, 0.18);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative select-none",
        "w-32 h-32 sm:w-36 sm:h-36",
        "transition-transform hover:-translate-y-0.5",
        selected ? "ring-2 ring-white/90 rounded-[75px]" : ""
      ].join(" ")}
      style={{ background: "transparent", WebkitTapHighlightColor: "transparent" }}
      title={selected ? "Selected" : "Click to select"}
    >
      <div
        className="absolute inset-x-0 top-3 bottom-0 mx-2 overflow-hidden"
        style={{
          borderTopLeftRadius: "18px",
          borderTopRightRadius: "18px",
          borderBottomLeftRadius: "26px",
          borderBottomRightRadius: "26px",
          backgroundColor: base,
          boxShadow: "0 8px 16px rgba(0,0,0,.35)",
          zIndex: 10
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 h-5 w-30 sm:w-36 rounded-2xl"
        style={{
          top: "0.25rem",
          backgroundColor: lid,
          boxShadow: "0 3px 6px rgba(0,0,0,.35)",
          zIndex: 20
        }}
      />
      <div className="absolute inset-0 grid place-items-center" style={{ zIndex: 30 }}>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/55 text-gray-900 max-w-[85%]">
          <span className="truncate font-medium text-sm">{label}</span>
          <span
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="grid place-items-center h-6 w-6 rounded-full bg-[#0f172a] text-white text-sm hover:opacity-90 cursor-pointer"
            aria-label={`Delete ${label}`}
          >
            ×
          </span>
        </div>
      </div>
    </button>
  );
}