import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "健保卡遺失換發指南 | 台灣醫療入口",
  description: "健保卡不見了怎麼辦？三種補辦管道、需要文件與無卡就醫解決方案。",
};

export default function NhiCardGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          健保卡遺失、損毀換發指南
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <p>
            健保卡是台灣民眾就醫最重要的憑證。如果發現健保卡不見了、或是卡片折損導致晶片讀取不良，請先別慌張，以下是三種最常見的補辦方式。
          </p>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、補辦管道（三選一）</h2>
            <ul className="list-disc pl-5 space-y-4">
              <li>
                <strong>1. 郵局代辦（最方便）：</strong> 
                攜帶身分證正本與 200 元工本費，至全台任一郵局填寫申請表。約 3-5 個工作天會掛號寄到指定地址。
              </li>
              <li>
                <strong>2. 健保署各分區業務組（最快）：</strong> 
                攜帶身分證正本與 200 元工本費，親自至健保署各區服務據點。現場可立即領取新卡（部分據點提供）。
              </li>
              <li>
                <strong>3. 線上申請（需有讀卡機）：</strong> 
                透過健保署「個人健保資料網路服務作業」網站，使用自然人憑證或已註冊的健保卡進行身分驗證，線上申請補發。
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、沒有健保卡可以看醫生嗎？</h2>
            <p>
              <strong>可以，但請先就醫！</strong>醫療院所依法必須先提供必要的醫療服務。若忘記帶卡或卡片遺失，可以先填寫「例外就醫名冊」，並在 10 天內（不含例假日）持補發的健保卡或相關證明至原就醫院所補刷退費。如果是緊急急診，醫院一定會先處理，絕不會因為無卡而見死不救。
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、如果急需就醫怎麼辦？</h2>
            <p>
              如果身體極度不適，請直接前往醫療院所。告知櫃檯人員健保卡遺失，並出示身分證或其他有照片的證件（如駕照、護照）。事後再盡快去補辦健保卡即可。
            </p>
            <div className="mt-4">
              <Link href="/clinics" className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-50 text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors">
                尋找附近診所 →
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
            <span>本站入圍衛福部 2006 年度優良健康資訊網站</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}