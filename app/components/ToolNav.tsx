"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ToolNav() {
  const pathname = usePathname();
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
        {tools.map((tool) => {
          const isActive = pathname === tool.href;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              {tool.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}