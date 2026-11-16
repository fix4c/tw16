import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";
import { ShareButtons } from "../../components/ShareButtons"; 

export const metadata: Metadata = {
  title: "看懂常規抽血報告 | 台灣醫療入口",
  description: "抽血報告紅字代表生病了嗎？帶你讀懂肝功能（GPT）、腎功能（eGFR）與血脂肪（膽固醇）的常見指標。",
};

export default function BloodTestGuidePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">看懂健檢報告</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
            看懂常規抽血報告：<br className="hidden md:block" />常見紅字指標大解析
          </h1>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <p>
              收到健康檢查報告，看到滿滿的紅字，先別自己嚇自己。許多紅字只是代表「超出了一般參考範圍」，並不等於「生病」。這篇文章帶你讀懂最常見的幾項抽血指標。
            </p>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、肝功能：GPT / ALT 與 GOT / AST</h2>
              <p>
                這兩個是最常見的肝功能指標。當肝細胞發炎或受損時，這些酵素會釋放到血液中，導致數值升高。
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>常見原因：</strong> 脂肪肝、B/C 型肝炎、喝酒、熬夜、亂吃成藥或保健食品。</li>
                <li><strong>怎麼做：</strong> 如果數值超標，先不要緊張。通常醫師會建議你先戒酒、少熬夜、停吃不必要的保健食品，3 個月後再抽血追蹤。若數值超過正常值兩倍以上，才需要進一步檢查。</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、腎功能：肌酸酐 (Creatinine) 與 eGFR</h2>
              <p>
                腎臟就像身體的濾水器。eGFR（腎絲球過濾率）是評估腎功能最重要的指標，數值越高越好。
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>正常：</strong> eGFR &gt; 90 mL/min/1.73m²</li>
                <li><strong>異常：</strong> eGFR &lt; 60 代表腎功能已有受損，建議至腎臟科就診。</li>
                <li><strong>怎麼做：</strong> 腎功能不好的人，千萬不要亂吃來路不明的中草藥或電台藥，也要控制好血糖與血壓（糖尿病與高血壓是洗腎的兩大元兇）。</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、血脂肪：總膽固醇、三酸甘油脂 (TG)、LDL</h2>
              <p>
                血脂異常是心血管疾病的隱形殺手。其中被稱為「壞膽固醇」的 LDL 更是關鍵。
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>數值超標怎麼辦？</strong> 若是輕微超標，通常建議先從「飲食與運動」調整（少油炸、少精緻糖、多運動），並使用本站的
                  <Link href="/tools/bmi" className="text-teal-600 font-bold hover:underline mx-1">BMI 計算器</Link>
                  監控體重。
                </li>
                <li><strong>注意：</strong> 如果你的 LDL 很高，或者你本身有糖尿病、曾發生心血管疾病，醫師通常會直接開立降血脂藥物（Statins），請務必按時服藥。</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">四、紅字不等於生病，但「追蹤」很重要</h2>
              <p>
                健檢的目的是「早期發現、早期治療」。看到紅字，正確的做法是把報告帶去給家醫科或內科醫師看，由醫師判斷是否需要進一步檢查或轉診。切勿自行上網買藥或聽信偏方。
              </p>
            </div>

            <div className="bg-slate-100 p-6 rounded-2xl mt-8 text-center">
              <h3 className="font-bold text-slate-900 mb-3">想進一步了解自己的身體數據？</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/hospitals" className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                  查詢醫院看報告
                </Link>
                <Link href="/tools/bmi" className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-full hover:bg-slate-50 transition-colors">
                  計算我的 BMI
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link href="/guides" className="text-sm font-bold text-teal-700 hover:underline">
              ← 返回就醫指南列表
            </Link>
          </div>

          {/* 👇 分享按鈕移入白色卡片內，並修正正確的標題 */}
          <ShareButtons title="看懂常規抽血報告：常見紅字指標大解析" />
          
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