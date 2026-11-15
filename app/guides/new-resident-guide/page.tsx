import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "新住民就醫指南 | 台灣醫療入口",
  description: "新住民與外籍移工在台就醫指南，包含健保卡申辦、就醫流程與友善醫療資源。",
};

export default function NewResidentGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          新住民就醫指南：<br className="hidden md:block" />看懂健保卡與就醫資源
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <p>
            台灣是一個多元包容的社會，有許多來自越南、印尼、泰國、菲律賓等國家的新住民與外籍移工在此生活。當身體不適需要就醫時，語言隔閡與對制度的不熟悉，常讓人感到焦慮。這份指南整理了在台灣就醫的基本須知。
          </p>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、如何取得健保卡？</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>新住民（持居留證）：</strong> 在台居留滿六個月起，即可加入全民健保。請向戶籍地的鄉鎮市區公所或透過任職公司辦理加保，並申請健保卡。</li>
              <li><strong>外籍移工：</strong> 通常由雇主協助辦理加保，若未拿到實體卡片，可先向雇主確認投保狀況。</li>
              <li><strong>尚未取得健保卡：</strong> 若遇緊急傷病，醫療院所依法必須先提供必要的醫療救治，費用可事後結清，不會因為沒有健保卡而被拒診。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、語言不通怎麼辦？</h2>
            <p>
              不用擔心，台灣許多醫院都設有「國際醫療中心」或通譯櫃檯，提供英語、越南語、印尼語等服務。若在診所就醫，也可以請通曉中文的朋友或雇主陪同。部分縣市政府衛生局也提供通譯人員媒合服務。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、該去診所還是醫院？</h2>
            <p>
              如果是感冒、腸胃炎等常見小病，建議先到住家附近的「健保特約診所」看診，費用較便宜且等候時間短。若症狀嚴重或需要精密檢查，診所醫師會開立轉診單，建議前往大型醫院就診。
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/clinics" className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-50 text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors">
                查找附近診所 →
              </Link>
            </div>
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