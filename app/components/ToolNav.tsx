"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_LINKS } from "../../config/site"; // 👈 引入配置

export function ToolNav() {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto pb-4 mb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {TOOL_LINKS.map((tool) => { // 👈 使用配置
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