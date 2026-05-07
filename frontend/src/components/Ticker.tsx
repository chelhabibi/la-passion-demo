const ITEMS = [
  { type: "award", text: "Michelin Guide 2024 · Recommended" },
  { type: "dish",  text: "Wagyu A4 Tenderloin" },
  { type: "award", text: "Best French-Vietnamese · Hà Nội 2023" },
  { type: "dish",  text: "Foie Gras au Cognac XO" },
  { type: "award", text: "Top 10 Fine Dining · Vietnam Guide" },
  { type: "dish",  text: "Chef's Table · 7 Courses" },
  { type: "award", text: "TripAdvisor Certificate of Excellence" },
  { type: "dish",  text: "Duck Confit · Citrus Jus" },
  { type: "award", text: "Wine Spectator Award 2023" },
  { type: "dish",  text: "Truffle Risotto · Mộc Châu" },
  { type: "award", text: "Asia's 50 Best · Honourable Mention" },
  { type: "dish",  text: "Tahitian Vanilla Crème Brûlée" },
] as const;

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-gold/15 py-4"
      style={{ background: "rgba(9,22,41,0.95)" }}>
      {/* Fade left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #091629 60%, transparent)" }} />
      {/* Fade right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #091629 60%, transparent)" }} />

      <div className="ticker-track flex items-center">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            {item.type === "award" ? (
              <span className="text-[10px] tracking-widest uppercase font-sans whitespace-nowrap"
                style={{ color: "#C9A84C" }}>
                {item.text}
              </span>
            ) : (
              <span className="font-serif text-sm font-light italic whitespace-nowrap"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                {item.text}
              </span>
            )}
            <span className="mx-8 text-[8px]" style={{ color: "rgba(201,168,76,0.35)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
