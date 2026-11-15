import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "看懂健康檢查報告 | 台灣醫療入口",
  description: "健檢報告紅字解析，帶你讀懂常見血液、肝腎功能與三高數據。",
};

export default function HealthCheckupGuidePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          看懂健康檢查報告：<br className="hidden md:block" />常見紅字指標解析
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <p>
            收到健康檢查報告，看到滿滿的紅字，先別自己嚇自己。許多紅字只是代表「超出了一般參考範圍」，並不等於「生病」。這篇文章帶你讀懂最常見的幾項指標。
          </p>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">一、三高指標（血壓、血糖、血脂）</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>血壓 (BP)：</strong> 理想值約為 120/80 mmHg。若超過 140/90 mmHg，可能為高血壓，建議在家多量幾次，並由醫師評估。</li>
              <li><strong>空腹血糖 (Glucose AC)：</strong> 正常值約 70-99 mg/dL。若介於 100-125 mg/dL 屬於「糖尿病前期」，大於 126 mg/dL 則需進一步確診。這通常與飲食習慣密切相關。</li>
              <li><strong>總膽固醇 (Cholesterol) & 三酸甘油脂 (TG)：</strong> 膽固醇過高可能增加心血管風險。若數值超標，通常建議先從少油、少糖、多運動開始調整。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">二、肝臟與腎臟功能</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>GPT / ALT（肝功能）：</strong> 這是肝臟發炎的指標。熬夜、喝酒、脂肪肝都可能導致數值偏高。若數值超過標準值兩倍以上，請務必至胃腸肝膽科追蹤。</li>
              <li><strong>肌酸酐 (Creatinine) / 腎絲球過濾率 (eGFR)：</strong> 評估腎臟過濾毒素的能力。若 eGFR 低於 60，代表腎功能已有受損，需要至腎臟科就診，並注意不要亂吃來路不明的藥物。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">三、紅字不等於生病，但「追蹤」很重要</h2>
            <p>
              健檢的目的是「早期發現、早期治療」。看到紅字，正確的做法是把報告帶去給家醫科或內科醫師看，由醫師判斷是否需要進一步檢查或轉診。切勿自行上網買藥或聽信偏方。
            </p>
            <div className="mt-4">
              <Link href="/hospitals" className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-50 text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors">
                查詢醫院掛號看報告 →
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
            <span>本站入圍衛福部 95 年度優良健康資訊網站</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}