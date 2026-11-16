import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "就醫指南 | 台灣醫療入口",
  description: "台灣醫療入口精選就醫指南，幫助您了解醫院掛號流程、健保制度、看懂報告與常見問題。",
};

export default function GuidesPage() {
  const guides = [
    {
      title: "全台醫院掛號指南：看懂門診表、避開掛號雷區",
      desc: "網路掛號怎麼用？現場號怎麼排？各大醫院系統差異在哪裡？一次講清楚。",
      href: "/guides/registration-guide",
      category: "就醫流程"
    },
    {
      title: "兩岸醫療面面觀：就醫流程與實用資源指南",
      desc: "大陸同胞來台就醫、台灣民眾赴大陸就醫的必讀指南。涵蓋健保給付與掛號流程差異。",
      href: "/guides/cross-strait-guide",
      category: "兩岸交流"
    },
    {
      title: "新住民就醫指南：看懂健保卡與就醫資源",
      desc: "剛來台灣的新住民、外籍移工該怎麼看醫生？從辦卡、語言通譯到找診所一次搞懂。",
      href: "/guides/new-resident-guide",
      category: "特殊族群"
    },
    {
      title: "看懂健康檢查報告：常見紅字指標解析",
      desc: "健檢報告滿江紅怎麼辦？紅字代表生病了嗎？帶你讀懂常規血液、肝腎功能與三高數據。",
      href: "/guides/health-checkup-guide",
      category: "看懂報告"
    },
    {
      title: "健保卡遺失、損毀換發指南",
      desc: "健保卡不見了先別慌！三種補辦管道、需要帶什麼文件、以及無卡就醫的解決方案。",
      href: "/guides/nhi-card-guide",
      category: "健保權益"
    },
    {
      title: "看懂常規抽血報告：常見紅字指標大解析",
      desc: "抽血報告紅字代表生病了嗎？帶你讀懂肝功能（GPT）、腎功能（eGFR）與血脂肪（膽固醇）的常見指標。",
      href: "/guides/blood-test-guide",
      category: "看懂報告"
    },
    {
      title: "高血壓日常控制指南：從量測到飲食的實戰守則",
      desc: "高血壓是沈默的殺手。了解如何正確量血壓、飲食控制（得舒飲食），以及何時應該就醫。",
      href: "/guides/hypertension-guide",
      category: "慢性病管理"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-16 w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">就醫指南</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            看懂台灣醫療體系
            <br className="hidden md:block" />
            讓就醫更省時省力
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            從掛號、看診、看懂報告到慢性病管理，我們整理了最實用的就醫指南，幫助您或家人第一次就醫就上手。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((g, i) => (
            <Link
              key={i}
              href={g.href}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md">
                  {g.category}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-2">
                {g.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                {g.desc}
              </p>
              <span className="text-sm font-semibold text-teal-700">閱讀全文 →</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}