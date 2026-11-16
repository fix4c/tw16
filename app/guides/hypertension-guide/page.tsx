import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "高血壓日常控制指南 | 台灣醫療入口",
  description: "高血壓是沈默的殺手。了解如何正確量血壓、飲食控制（得舒飲食），以及何時應該就醫。",
};

export default function HypertensionGuidePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">慢性病管理</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
            高血壓日常控制指南：<br className="hidden md:block" />從量測到飲食的實戰守則
          </h1>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <p>
              高血壓被稱為「沈默的殺手」，因為它初期幾乎沒有症狀，卻會默默損害心臟、血管、腎臟與大腦。在台灣，每 4 個成年人就有 1 個有高血壓。這篇文章帶你了解如何正確量測、透過飲食控制，以及何時該尋求醫療協助。
            </p>

            <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
              <h3 className="font-serif text-lg font-bold text-teal-900 mb-2">👨‍⚕️ 醫師小叮嚀</h3>
              <p className="text-sm text-teal-800">
                血壓數值不是看一次就定生死。若在醫院量測偏高，可能是「白袍高血壓」。建議在家早晚各量一次，連續記錄 7 天，並利用本站的
                <Link href="/tools/health-tracker" className="font-bold text-teal-600 underline mx-1">三高記錄表</Link>
                記錄下來，這對醫師診斷非常有幫助。
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、血壓多少才算高？</h2>
              <p>
                根據台灣心臟學會標準，居家血壓監測的標準如下：
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong className="text-emerald-600">正常：</strong> 收縮壓 &lt; 120 且 舒張壓 &lt; 80 mmHg</li>
                <li><strong className="text-amber-600">偏高：</strong> 收縮壓 120-139 或 舒張壓 80-89 mmHg</li>
                <li><strong className="text-rose-600">高血壓：</strong> 收縮壓 ≥ 140 或 舒張壓 ≥ 90 mmHg</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、正確量血壓的 4 個步驟</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>安靜休息：</strong> 測量前 30 分鐘內不要抽菸、喝咖啡或運動。坐在椅子上安靜休息 5 分鐘。</li>
                <li><strong>姿勢正確：</strong> 雙腳平踏地面，不翹二郎腿。手臂放在桌上，壓脈帶與心臟同高。</li>
                <li><strong>連續測量：</strong> 每次量 2 次，間隔 1 分鐘，取平均值。</li>
                <li><strong>固定時間：</strong> 建議每天早晨起床後（吃藥前）與睡前各量一次。</li>
              </ol>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、得舒飲食（DASH Diet）：不用挨餓的降壓法</h2>
              <p>
                除了吃藥，飲食是控制血壓的關鍵。得舒飲食是目前公認最有效的降血壓飲食法，重點是「高鉀、高鈣、高鎂、低鈉」。
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>多吃：</strong> 深綠色蔬菜、水果（如香蕉、奇異果）、全穀雜糧（糙米、燕麥）、低脂乳製品、堅果。</li>
                <li><strong>少吃：</strong> 加工食品（香腸、罐頭）、醃漬物、泡麵、濃湯，這些都是「隱形鈉」的來源。</li>
                <li><strong>調味：</strong> 減少使用醬油、烏醋，多用蔥、薑、蒜、檸檬汁提味。</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">四、什麼時候該去醫院？</h2>
              <p>
                如果你的血壓持續高於 140/90 mmHg，請盡速至家醫科或心臟內科就診。若血壓突然飆高（如超過 180/120 mmHg），並伴隨以下症狀，請立即打 119：
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-rose-600 font-medium">
                <li>劇烈頭痛、頭暈</li>
                <li>胸痛、胸悶、呼吸困難</li>
                <li>視力模糊</li>
                <li>單側手腳無力或說話不清</li>
              </ul>
            </div>

            <div className="bg-slate-100 p-6 rounded-2xl mt-8 text-center">
              <h3 className="font-bold text-slate-900 mb-3">開始追蹤你的血壓吧！</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/health-tracker" className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                  填寫三高記錄表
                </Link>
                <Link href="/hospitals" className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-full hover:bg-slate-50 transition-colors">
                  查詢心臟內科掛號
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link href="/guides" className="text-sm font-bold text-teal-700 hover:underline">
              ← 返回就醫指南列表
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