import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "兩岸醫療面面觀 | 台灣醫療入口",
  description: "台灣民眾赴大陸就醫，或大陸同胞來台就醫的實用指南。涵蓋健保給付、就醫流程與醫療資源導航。",
};

export default function CrossStraitGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/guides" className="font-serif text-xl font-bold text-slate-900 hover:text-teal-700 transition-colors">
            ← 就醫指南
          </Link>
          <span className="text-xs font-medium text-slate-500">兩岸醫療交流</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          兩岸醫療面面觀：<br className="hidden md:block" />就醫流程與實用資源指南
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <p>
            隨著兩岸經貿與民間交流的頻繁，無論是台灣民眾前往大陸工作、旅遊、探親，或是大陸同胞來台就學、商務考察，了解當地的醫療體系與就醫流程，已成為不可或缺的實用知識。本指南整理了兩岸就醫的核心差異與注意事項。
          </p>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、台灣民眾赴大陸就醫指南</h2>
            <p className="mb-4">
              台灣民眾在大陸若遇突發疾病或意外，可前往當地的「三級甲等醫院」（簡稱三甲醫院），這相當於台灣的醫學中心，設備與專科最為齊全。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>掛號方式：</strong> 大陸醫院多數已全面數位化，通常需要透過醫院的微信公眾號、支付寶或專屬 App 進行實名制預約掛號。現場掛號名額極少。</li>
              <li><strong>證件準備：</strong> 台灣民眾就醫時，必須出示「台灣居民來往大陸通行證」（台胞證）。部分醫院可能要求辦理當地的「就診卡」。</li>
              <li><strong>費用與健保：</strong> 大陸就醫通常需先全額自費（可使用微信支付或支付寶）。回台後，可憑醫療收據正本、診斷證明書與出入境證明，向台灣健保署申請「自墊醫療費用核退」，但給付金額有上限。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、大陸同胞來台就醫指南</h2>
            <p className="mb-4">
              大陸同胞來台旅遊或商務期間，若需就醫，台灣的醫療院所（診所、區域醫院、醫學中心）皆可接待，但流程與大陸略有不同。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>掛號方式：</strong> 台灣醫院多數接受現場掛號，但強烈建議提前透過網路或電話預約。部分醫院對「非本國籍人士」設有專屬的國際醫療中心，提供專人協助。</li>
              <li><strong>證件準備：</strong> 需出示「大陸居民往來台灣通行證」（大通證）與入台證。</li>
              <li><strong>費用：</strong> 非台灣健保對象就醫，需全額自費。台灣醫學中心的門診掛號費與部分負擔較高，建議攜帶足夠的現金或信用卡。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、在台灣如何快速找到醫療資源？</h2>
            <p className="mb-4">
              如果您或您的親友在台灣需要就醫，可以利用本站的導航工具快速找到合適的醫療機構：
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/hospitals" className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-50 text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors">
                查詢全台醫院掛號 →
              </Link>
              <Link href="/clinics" className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                尋找附近診所 →
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">四、國際醫療資訊的獲取</h2>
            <p>
              傳染病沒有國界。本站每日自動聚合台灣衛福部、疾管署、大陸新華網，以及世界衛生組織（WHO）的最新醫療資訊。無論您身在何處，都能透過本站掌握兩岸與國際的公共衛生動態，為您的健康保駕護航。
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/guides" className="text-sm font-bold text-teal-700 hover:underline">
            ← 返回就醫指南列表
          </Link>
        </div>
      </article>

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