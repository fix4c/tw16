import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      腎功能檢查通常包含肌酸酐、eGFR（ estimated Glomerular Filtration Rate， estimated 腎絲球過濾率）與尿蛋白。這些數值能反映腎臟過濾能力，但單次異常不等於慢性腎臟病。這篇指南說明這些指標怎麼解讀、慢性腎臟病的分期概念，以及何時該看腎臟科。
    </p>
  ),
  highlights: [
    '肌酸酐（Creatinine）是肌肉代謝產物，受肌肉量、年齡、性別影響，不能單看數值。',
    'eGFR 是以肌酸酐搭配年齡、性別推算的過濾率，常用於慢性腎臟病分期。',
    '尿蛋白（或 UPCR）是腎臟受損的重要指標，與 eGFR 一起看才完整。',
  ],
  body: (
    <>
      <h2>常見腎功能指標</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">指標</th>
              <th className="py-2 pr-4">代表什麼</th>
              <th className="py-2 pr-4">要注意的地方</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">肌酸酐</td>
              <td className="py-2 pr-4">肌肉代謝產物，由腎臟排出</td>
              <td className="py-2 pr-4">肌肉量大者數值可能較高；老年人肌肉量少，數值可能低估腎功能受損</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">eGFR</td>
              <td className="py-2 pr-4">推算的腎絲球過濾率</td>
              <td className="py-2 pr-4">以公式推算，並非直接測量；急性腎損傷時可能不準</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">尿蛋白 / UPCR</td>
              <td className="py-2 pr-4">腎臟是否漏蛋白</td>
              <td className="py-2 pr-4">需以晨尿或隨機尿的蛋白/肌酸酐比值評估較準確</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">尿素氮（BUN）</td>
              <td className="py-2 pr-4">蛋白質代謝產物</td>
              <td className="py-2 pr-4">受飲食、脫水、肝臟功能影響</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        各實驗室參考區間不同，報告上的數值與「紅字」意義以該院報告為準。
      </p>

      <h2>eGFR 與慢性腎臟病分期</h2>
      <p>
        eGFR 以 mL/min/1.73m² 為單位，常用於慢性腎臟病（CKD）分期。分期還需搭配尿蛋白與腎臟影像，不能只看 eGFR：
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">分期</th>
              <th className="py-2 pr-4">eGFR 範圍（參考）</th>
              <th className="py-2 pr-4">說明</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 1 期</td>
              <td className="py-2 pr-4">≥ 90</td>
              <td className="py-2 pr-4">正常或偏高，但合併尿蛋白或其他腎損傷證據</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 2 期</td>
              <td className="py-2 pr-4">60–89</td>
              <td className="py-2 pr-4">輕度下降，合併腎損傷證據</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 3a 期</td>
              <td className="py-2 pr-4">45–59</td>
              <td className="py-2 pr-4">輕度至中度下降</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 3b 期</td>
              <td className="py-2 pr-4">30–44</td>
              <td className="py-2 pr-4">中度至重度下降</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 4 期</td>
              <td className="py-2 pr-4">15–29</td>
              <td className="py-2 pr-4">重度下降</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 5 期</td>
              <td className="py-2 pr-4">&lt; 15</td>
              <td className="py-2 pr-4">末期腎病，可能需透析評估</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        分期須由醫師依完整資料判定；此表僅供理解概念，不是診斷依據。
      </p>

      <h2>單次異常不代表慢性腎臟病</h2>
      <p>
        慢性腎臟病的判定通常需<strong>持續三個月以上</strong>的異常。單次 eGFR 偏低可能與：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>脫水、發燒、感染。</li>
        <li>劇烈運動、高蛋白飲食。</li>
        <li>藥物（如部分止痛藥、抗生素）。</li>
        <li>急性腎損傷（數天內變化）。</li>
      </ul>
      <p>
        通常會建議複檢，搭配尿蛋白、影像與病史判斷。
      </p>

      <h2>尿蛋白與 eGFR 一起看</h2>
      <p>
        尿蛋白是腎臟受損的重要指標，即使 eGFR 正常，持續尿蛋白也需評估。反之，eGFR 偏低但無尿蛋白，原因可能不同。兩者需一起看，不能只看一項。
      </p>

      <h2>什麼情況該看腎臟科</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>eGFR 持續低於 60，或短期內明顯下降。</li>
        <li>持續尿蛋白陽性或 UPCR 偏高。</li>
        <li>血尿合併腎功能異常。</li>
        <li>電解質異常（如鉀、鈉、鈣、磷）。</li>
        <li>水腫、泡泡尿久不消散。</li>
        <li>糖尿病、高血壓合併腎功能異常。</li>
      </ul>
    </>
  ),
};