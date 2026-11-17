"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_LINKS } from "../../config/site";

export function ToolNav() {
  const pathname = usePathname();

  return (
    // 👇 徹底移除任何可能導致橫向滾動的設定
    <div className="w-full pb-4 mb-2">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
        {TOOL_LINKS.map((tool) => {
          const isActive = pathname === tool.href;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`flex items-center justify-center text-center px-2 py-2.5 border rounded-xl text-[13px] md:text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              {/* 處理字數過多的情況，確保不會撐破格子 */}
              <span className="truncate">{tool.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}