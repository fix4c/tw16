export function AdPlaceholder({ type = "banner" }: { type?: "banner" | "box" }) {
  if (type === "banner") {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 py-4">
        <div className="w-full h-[90px] bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center text-neutral-400 text-sm">
          預留橫幅廣告版位（728x90 / 970x90）
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[250px] bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center text-neutral-400 text-sm">
      預留矩形廣告版位（300x250）
    </div>
  );
}