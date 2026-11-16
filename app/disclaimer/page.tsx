import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "醫療免責聲明 | 台灣醫療入口",
  description: "台灣醫療入口網站的醫療免責聲明，本站不提供醫療診斷與治療建議。",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">
            醫療免責聲明
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
            <p>最後更新日期：2026年11月16日</p>
            <p>
              歡迎使用「台灣醫療入口」（https://tw16.net，以下簡稱本站）。在使用本站提供的任何資訊與工具前，請務必詳細閱讀以下聲明：
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">一、本站不提供醫療診斷</h2>
            <p>
              本站是一個由 AI 自動策展的醫療資訊導航站。<strong>本站所有的內容（包含但不限於 AI 生成的新聞摘要、症狀查科別、醫療小幫手、BMI 計算器、三高記錄表等），僅供一般民眾作為健康資訊參考，絕不構成專業醫療診斷、治療建議或用藥指引。</strong>
            </p>
            <p>
              本站無法取代專業醫師、藥師、護理師或其他醫療照護人員的面對面評估與診斷。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">二、緊急狀況處理</h2>
            <p>
              如果您或身邊的人出現緊急醫療狀況（如突發劇烈胸痛、呼吸困難、意識不清、大量出血等），<strong>請立即撥打 119 呼叫救護車，或直接前往最近的醫院急診室</strong>，切勿依賴本站資訊延誤就醫。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">三、AI 內容與外部連結</h2>
            <p>
              本站的新聞摘要由 AI 自動生成，我們已盡力過濾錯誤與亂碼，但仍無法保證所有內容 100% 準確無誤。所有新聞皆附有「查看原始出處」連結，建議您點擊前往官方網站確認原始資訊。
            </p>
            <p>
              本站包含通往外部網站（如各醫院掛號系統、健保署）的連結。這些外部網站的內容與隱私政策由各該機構負責，本站不承擔任何連帶責任。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">四、社群評價功能</h2>
            <p>
              本站的「值得推薦」與「有待加強」功能，僅代表匿名網友的個人主觀感受，不代表本站立場，亦不構成任何醫療機構之醫療品質認證或排名依據。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">五、損害賠償限制</h2>
            <p>
              您理解並同意，使用本站服務所產生的任何風險均由您自行承擔。本站對於因使用或無法使用本站資訊所導致的任何直接或間接損害，不負任何法律責任。
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link href="/" className="text-sm font-bold text-teal-700 hover:underline">
              ← 返回首頁
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}