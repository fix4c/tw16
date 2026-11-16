import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "隱私權政策 | 台灣醫療入口",
  description: "台灣醫療入口網站的隱私權政策，說明我們如何處理與保護您的資料。",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">
            隱私權政策
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
            <p>最後更新日期：2026年11月16日</p>
            <p>
              歡迎使用「台灣醫療入口」（https://tw16.net，以下簡稱本站）。我們非常重視您的隱私與資料安全。本政策說明本站如何收集、使用及保護您的資訊。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">一、我們收集的資訊</h2>
            <p>
              <strong>1. 個人識別資訊：</strong> 本站為免註冊、免登入的資訊導航網站，<strong>我們不會主動要求您提供姓名、身分證字號、電話或電子郵件等個人識別資訊。</strong>
            </p>
            <p>
              <strong>2. 本地健康數據：</strong> 當您使用本站的「BMI計算」、「三高記錄」或「飲水量計算」等工具時，所輸入的數據僅儲存於您個人瀏覽器的本地儲存空間（localStorage）。<strong>這些數據不會上傳至本站的伺服器，本站亦無法讀取。</strong> 您可以隨時透過清除瀏覽器資料來刪除這些紀錄。
            </p>
            <p>
              <strong>3. 匿名流量分析：</strong> 本站使用 Cloudflare Web Analytics 進行流量統計。該工具不收集個人隱私資料，亦不使用 Cookie 追蹤您的跨站行為。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">二、第三方服務與廣告</h2>
            <p>
              本站有接入第三方服務，這些服務可能會有其各自的隱私權政策：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google AdSense：</strong> 本站使用 Google AdSense 放送廣告。Google 可能會使用 Cookie（如 DoubleClick DART Cookie）根據您過去對本站及其他網站的造訪紀錄，向您顯示個人化廣告。您可以前往 <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Google 廣告設定</a> 選擇停用個人化廣告。</li>
              <li><strong>Cloudflare Turnstile：</strong> 本站使用 Turnstile 進行防機器人驗證，以確保社群評價數據的真實性。該服務不會追蹤您的個人身分。</li>
              <li><strong>Google 翻譯：</strong> 本站使用 Google 翻譯提供多語言瀏覽，使用該功能時可能會設定相關 Cookie。</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">三、資料安全</h2>
            <p>
              本站採用全球頂尖的 Cloudflare CDN 與靜態網站架構（Next.js Static Export），所有連線皆受 HTTPS 加密保護。由於本站不儲存您的個人資料，您的隱私風險極低。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">四、政策修改</h2>
            <p>
              本站保留隨時修改本隱私權政策的權利。修改後的條款將直接公佈於本頁面，不另行通知。
            </p>

            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-8 mb-3">五、聯絡我們</h2>
            <p>
              若您對本隱私權政策有任何疑問，歡迎來信聯絡：<a href="mailto:tw16.net@gmail.com" className="text-teal-600 underline">tw16.net@gmail.com</a>
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