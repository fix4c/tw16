import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      空腹血糖與糖化血色素（HbA1c）是評估血糖控制最常用的兩項指標。這篇指南說明它們的意義、糖尿病前期的判斷概念、追蹤頻率，以及什麼情況該看內分泌暨新陳代謝科。
    </p>
  ),
  highlights: [
    '空腹血糖反映抽血當下的血糖；HbA1c 反映過去約 2–3 個月的平均血糖。',
    '糖尿病前期的判定需依標準流程，單次數值異常通常需複檢確認。',
    '各實驗室參考區間與檢測方法不同，報告上的數值意義以該院報告與醫師判讀為準。',
  ],
  body: (
    <>
      <h2>兩項指標的差異</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">指標</th>
              <th className="py-2 pr-4">反映的時間</th>
              <th className="py-2 pr-4">常見用途</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">空腹血糖</td>
              <td className="py-2 pr-4">抽血當下</td>
              <td className="py-2 pr-4">篩檢、診斷、日常追蹤</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">飯後血糖</td>
              <td className="py-2 pr-4">進食後 2 小時</td>
              <td className="py-2 pr-4">評估餐後血糖控制</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">糖化血色素（HbA1c）</td>
              <td className="py-2 pr-4">過去約 2–3 個月平均</td>
              <td className="py-2 pr-4">長期控制評估、調藥依據</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        各實驗室參考區間與檢測方法不同，報告上的數值意義以該院報告為準。
      </p>

      <h2>數值區間的概念</h2>
      <p>
        以下是一般常用的概念區間，<strong>僅供理解，不能用於自我診斷</strong>；實際判定需依醫師與該院標準：
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">狀態</th>
              <th className="py-2 pr-4">空腹血糖（mg/dL）</th>
              <th className="py-2 pr-4">HbA1c（%）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">一般正常</td>
              <td className="py-2 pr-4">&lt; 100</td>
              <td className="py-2 pr-4">&lt; 5.7</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">糖尿病前期</td>
              <td className="py-2 pr-4">100–125</td>
              <td className="py-2 pr-4">5.7–6.4</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">糖尿病</td>
              <td className="py-2 pr-4">≥ 126（需複檢確認）</td>
              <td className="py-2 pr-4">≥ 6.5（需複檢確認）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        糖尿病診斷通常需<strong>兩次異常</strong>或搭配症狀與其他檢查確認；單次數值異常不代表確診。
      </p>

      <h2>糖尿病前期：可逆的階段</h2>
      <p>
        糖尿病前期是血糖已高於正常但尚未達糖尿病標準的階段。透過生活調整，有機會延緩或避免進展為糖尿病：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>體重控制：減輕 5–7% 體重即有幫助。</li>
        <li>規律運動：每週至少 150 分鐘中等強度。</li>
        <li>飲食調整：減少精緻糖與含糖飲料，增加蔬菜與膳食纖維。</li>
        <li>戒菸、適量飲酒。</li>
        <li>定期追蹤血糖與 HbA1c。</li>
      </ul>

      <h2>追蹤頻率的建議</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>一般成人：依年齡與風險因子，每 1–3 年篩檢一次。</li>
        <li>糖尿病前期：每 6–12 個月追蹤。</li>
        <li>糖尿病患者：依醫囑，通常每 3 個月測 HbA1c。</li>
        <li>懷孕：依產檢時程進行妊娠糖尿病篩檢。</li>
      </ul>
      <p>
        實際頻率依個人風險、醫師判斷與健保給付規定調整。
      </p>

      <h2>什麼情況該看內分泌暨新陳代謝科</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>空腹血糖或 HbA1c 達糖尿病前期或糖尿病標準。</li>
        <li>已確診糖尿病，需調整治療或追蹤併發症。</li>
        <li>體重明顯變化、多吃多喝多尿。</li>
        <li>家族史明顯、代謝症候群、多囊性卵巢等風險因子。</li>
      </ul>
    </>
  ),
};