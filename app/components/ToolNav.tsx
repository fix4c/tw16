import Link from "next/link";

export function ToolNav() {
  const tools = [
    { href: "/tools/bmi", label: "⚖️ BMI 計算" },
    { href: "/tools/water", label: "💧 飲水量計算" },
    { href: "/tools/health-tracker", label: "🩺 三高記錄" },
    { href: "/tools/symptoms", label: "🔍 症狀查科別" },
    { href: "/tools/assistant", label: "🧭 醫療小幫手" },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 mb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-teal-400 hover:text-teal-700 hover:shadow-sm transition-all"
          >
            {tool.label}
          </Link>
        ))}
      </div>
    </div>
  );
}