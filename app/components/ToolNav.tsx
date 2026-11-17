"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_LINKS } from "../../config/site";

export function ToolNav() {
  const pathname = usePathname();

  return (
    <div className="w-full pb-4 mb-2">
      {/* 👇 移除 overflow-x-auto 與 min-w-max，改用 flex-wrap 讓按鈕自動換行 */}
      <div className="flex flex-wrap gap-2">
        {TOOL_LINKS.map((tool) => {
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