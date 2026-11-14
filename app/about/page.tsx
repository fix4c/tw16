import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "關於本站 | 台灣醫療入口",
  description:
    "tw16.net 是一個由 AI 自動策展的台灣醫療資訊導航站，所有內容從衛福部、疾管署、食藥署等公開權威來源聚合，不提供醫療診斷。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          
          {/* 👇 這裡補上了導航菜單 */}
          <nav className="flex items-center gap-4 md:gap-5">
            <Link href="/hospitals" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">診所查找</Link>
            <Link href="/guides" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">就醫指南</Link>
            <Link href="/about" className="text-sm font-medium text-teal-700 transition-colors">關於本站</Link>
          </nav>
          
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">
          關於本站
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-8">
          一個不做診斷的
          <br className="hidden md:block" />
          台灣醫療資訊導航站
        </h1>

        <section className="prose prose-neutral max-w-none space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              本站是什麼
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              tw16.net 是一個由 AI 自動策展的台灣醫療資訊入口。它不生產內容、不經營論壇、不提供任何醫療建議，只做一件事：從衛生福利部、疾病管制署、食品藥物管理署等公開權威來源，每日自動聚合最值得一般民眾知道的醫療資訊，並改寫成看得懂的白話摘要。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              本站不做什麼
            </h2>
            <ul className="space-y-2 text-neutral-700 leading-relaxed list-disc pl-5">
              <li>不提供醫療診斷、治療建議或用藥指引</li>
              <li>不取代醫師、藥師或任何醫療專業人員的判斷</li>
              <li>不販售任何產品、不承接任何醫療廣告</li>
              <li>不收集個人健康資料、不要求註冊會員</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              任何健康問題，請諮詢醫師或撥打 1922 防疫專線、1995 安心專線、1966 長照專線。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              AI 怎麼工作
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              每天清晨，系統會自動執行以下流程，全程無人工介入：
            </p>
            <ol className="space-y-3 text-neutral-700 leading-relaxed list-decimal pl-5">
              <li>
                <span className="font-medium">抓取</span>
                ：從四個官方與權威 RSS 源取得最新公告
              </li>
              <li>
                <span className="font-medium">篩選</span>
                ：由 AI 判斷哪些公告對一般民眾最相關、主題不重複
              </li>
              <li>
                <span className="font-medium">改寫</span>
                ：將公文語言改寫成 2–3 句白話摘要，並加上「為什麼與你有關」
              </li>
              <li>
                <span className="font-medium">發布</span>
                ：寫入網站資料檔，自動部署到全球 CDN
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              資料來源
            </h2>
            <ul className="space-y-2 text-neutral-700 leading-relaxed">
              <li>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200 mr-2">
                  一級
                </span>
                衛生福利部 RSS
              </li>
              <li>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200 mr-2">
                  一級
                </span>
                疾病管制署 RSS
              </li>
              <li>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200 mr-2">
                  一級
                </span>
                食品藥物管理署 RSS
              </li>
              <li>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200 mr-2">
                  一級
                </span>
                新華網健康頻道（經簡轉繁與在地化處理）
              </li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3 text-sm">
              所有內容皆附原始出處連結，可點擊卡片底部的「查看原始出處」直達官方頁面核對。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              透明度承諾
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              本站首頁底部永遠顯示「最後自動更新」時間。若系統故障或某個來源連續多日無回應，網站會停止更新而非顯示過期內容。所有 AI 生成的摘要都經過字元清理與格式驗證，避免編碼異常或亂碼影響閱讀。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              維護方式
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              本站由私人名義維護，非營利、無廣告、無商業合作。日常運作完全自動化，人類僅在資料來源改版或 API 額度用盡時介入調整。這是一個實驗：在 AI 時代，一個公共資訊入口網站是否可能以「零編輯台」的方式持續運作。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-3">
              聯絡
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              發現內容錯誤、來源失效、或任何建議，歡迎來信：
              <a
                href="mailto:tw16.net@gmail.com"
                className="text-blue-700 hover:underline ml-1"
              >
                tw16.net@gmail.com
              </a>
            </p>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-neutral-200">
          <Link
            href="/"
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            ← 回到首頁
          </Link>
        </div>
      </article>

      <footer className="border-t border-neutral-200 bg-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站
        </div>
      </footer>
    </main>
  );
}