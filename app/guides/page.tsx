import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header"; 

export const metadata: Metadata = {
  title: "就醫指南 | 台灣醫療入口",
  description: "台灣醫療入口精選就醫指南，幫助您了解醫院掛號流程、健保制度與常見問題。",
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

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
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
              全台醫院掛號指南：看懂門診表、避開掛號雷區
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              網路掛號怎麼用？現場號怎麼排？各大醫院系統差異在哪裡？一次講清楚。
            </p>
            <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
          </Link>

          <Link
            href="/guides/cross-strait-guide"
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
              兩岸醫療面面觀：就醫流程與實用資源指南
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              大陸同胞來台就醫、台灣民眾赴大陸就醫的必讀指南。涵蓋健保給付與掛號流程差異。
            </p>
            <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
          </Link>

          <Link
            href="/guides/new-resident-guide"
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
              新住民就醫指南：看懂健保卡與就醫資源
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              剛來台灣的新住民、外籍移工該怎麼看醫生？從辦卡、語言通譯到找診所一次搞懂。
            </p>
            <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
          </Link>

          <Link
            href="/guides/health-checkup-guide"
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
              看懂健康檢查報告：常見紅字指標解析
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              健檢報告滿江紅怎麼辦？紅字代表生病了嗎？帶你讀懂常規血液、肝腎功能與三高數據。
            </p>
            <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
          </Link>

          <Link
            href="/guides/nhi-card-guide"
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
              健保卡遺失、損毀換發指南
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              健保卡不見了先別慌！三種補辦管道、需要帶什麼文件、以及無卡就醫的解決方案。
            </p>
            <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-slate-500 text-center leading-relaxed">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 95 年度優良健康資訊網站（2006年）</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>

    </main>
  );
}