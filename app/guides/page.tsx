import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "就醫指南 | 台灣醫療入口",
  description: "台灣醫療入口精選就醫指南，幫助您了解醫院掛號流程、健保制度與常見問題。",
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/hospitals" className="text-neutral-500 hover:text-teal-700 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-neutral-500 hover:text-teal-700 transition-colors">院所查詢</Link>
            <Link href="/tools/symptoms" className="font-medium text-teal-700">症狀查科別</Link>
            <Link href="/tools/bmi" className="text-neutral-500 hover:text-teal-700 transition-colors">BMI計算</Link>
            <Link href="/guides" className="text-neutral-500 hover:text-teal-700 transition-colors">就醫指南</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">就醫指南</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          看懂台灣醫療體系
          <br className="hidden md:block" />
          讓就醫更省時省力
        </h1>
        <p className="text-neutral-600 max-w-2xl leading-relaxed mb-8">
          從掛號、看診到領藥，我們整理了實用的就醫指南，幫助您或家人第一次就醫就上手。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/guides/registration-guide"
            className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all"
          >
            <h2 className="font-serif text-xl font-bold text-neutral-900 group-hover:text-teal-700 mb-2">
              全台醫院掛號指南：看懂門診表、避開掛號雷區
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              網路掛號怎麼用？現場號怎麼排？各大醫院系統差異在哪裡？一次講清楚。
            </p>
            <span className="text-sm font-medium text-teal-700">閱讀全文 →</span>
          </Link>
          
          {/* 預留給未來的第二篇文章 */}
          <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <p className="text-neutral-400 text-sm mb-2">更多指南即將上線</p>
            <p className="text-xs text-neutral-400">健保卡使用教學、看懂健檢報告...</p>
          </div>
        </div>
      </section>
    </main>
  );
}