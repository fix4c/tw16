import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "全台醫院掛號指南 | 台灣醫療入口",
  description: "搞懂台灣醫院掛號流程！從網路掛號、現場號、轉診到各大醫院系統差異，幫助您節省候診時間。",
};

export default function RegistrationGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/guides" className="font-serif text-xl font-bold text-neutral-900 hover:text-teal-700 transition-colors">
            ← 就醫指南
          </Link>
          <span className="text-xs text-neutral-500">就醫指南</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-6">
          全台醫院掛號指南：<br className="hidden md:block" />看懂門診表、避開掛號雷區
        </h1>
        
        <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">
          <p>
            對許多台灣民眾來說，去大醫院看診是件令人頭痛的事：不知道該掛哪一科、網路掛號滿號、到了現場發現看診進度嚴重落後。這篇文章帶你一次搞懂全台主要醫院的掛號邏輯，讓你下次就醫不再手忙腳亂。
          </p>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">一、網路掛號 vs. 現場掛號，該選哪個？</h2>
            <p>
              現在全台醫學中心與區域醫院，強烈建議使用「網路掛號」或「App 掛號」。網路掛號通常會保留大部分的號碼，現場號往往只剩個位數，且需要很早去排隊。
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>網路掛號：</strong> 24 小時開放，可提前 2 週至 1 個月預約，部分醫院提供「初診」專屬名額。</li>
              <li><strong>現場掛號：</strong> 通常早上 6:00 - 7:30 開放抽號碼牌，名額極少，適合網路掛號已滿但急需看診的狀況。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">二、看懂「看診進度」很重要</h2>
            <p>
              大醫院的門診常常「塞車」。如果你掛的是 50 號，千萬不要 9 點就去等。現在的醫院官網或 App 都有「看診進度」功能，只要在預估時間前 20 分鐘到達診間插健保卡報到即可。
            </p>
            <p className="mt-3">
              你可以善用本站的 <Link href="/hospitals" className="text-teal-700 font-medium hover:underline">醫院掛號導航</Link>，找到醫院後，直接點擊進入該院的官方系統查看進度。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">三、各大醫院掛號系統差異</h2>
            <p>台灣的醫院掛號系統因集團而異，熟悉以下幾家龍頭醫院的系統，其他醫院通常大同小異：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>長庚體系（長庚、長庚分院）：</strong> 系統高度整合，有自己的「長庚e指通」App，掛號與查詢非常方便。</li>
              <li><strong>臺大體系（臺大、雲林、新竹等分院）：</strong> 通常需透過「臺大醫院網路掛號」單一入口，初診需填寫詳細資料。</li>
              <li><strong>榮總體系（北榮、中榮、高榮）：</strong> 各分院網頁相對獨立，但介面類似，皆有提供「初診預約」功能。</li>
              <li><strong>中國醫藥大學體系：</strong> 系統整合度極高，甚至可以直接在網頁上看到醫師的專長與看診人數。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">四、掛號常見雷區（注意事項）</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>爽約紀錄：</strong> 若網路掛號後未到診且未取消，累積數次（通常 3 次）會被醫院停權，無法再使用網路掛號。</li>
              <li><strong>初診限制：</strong> 許多醫院的初診只能「網路預約」或「現場辦理」，無法使用 App 或語音掛號。就醫前請先確認。</li>
              <li><strong>轉診單：</strong> 如果你有基層診所的「轉診單」，通常可以享有「優先保留號」，能大幅減少等待時間。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">五、下一步：尋找你要的醫院或診所</h2>
            <p>
              搞懂掛號規則後，你可以直接使用本站的導航功能：
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/hospitals" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">
                查詢醫院掛號 →
              </Link>
              <Link href="/clinics" className="inline-flex items-center justify-center px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full hover:bg-neutral-200 border border-neutral-200 transition-colors">
                尋找附近診所 →
              </Link>
            </div>
          </div>
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