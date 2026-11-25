import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      台灣的醫療院所分為基層診所、地區醫院、區域醫院、醫學中心四個層級，但多數民眾並不清楚「什麼病該去哪一層」。這篇指南用一張表、三個情境，幫你在出發就醫前做出選擇，同時說明轉診對部分負擔的實際影響。
    </p>
  ),
  highlights: [
    '一般感冒、慢性病追蹤、輕微外傷 → 先找住家附近的基層診所，部分負擔最低。',
    '需要專科檢查、手術評估或住院 → 由診所醫師開立轉診單，經轉診至區域醫院或醫學中心，部分負擔明顯低於自行前往。',
    '醫學中心的核心任務是急重症、罕病與教學研究；未經轉診直接到醫學中心看門診，部分負擔最高。',
  ],
  body: (
    <>
      <h2>四層級的核心差異：任務、部分負擔、就醫方式</h2>
      <p>四層級的核心差異可以歸納為三件事：任務、部分負擔、就醫方式。</p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">層級</th>
              <th className="py-2 pr-4">主要任務</th>
              <th className="py-2 pr-4">門診部分負擔（經轉診）</th>
              <th className="py-2 pr-4">門診部分負擔（未經轉診）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">基層診所</td>
              <td className="py-2 pr-4">一般門診、慢性病追蹤、第一線照護</td>
              <td className="py-2 pr-4">50 元</td>
              <td className="py-2 pr-4">50 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">地區醫院</td>
              <td className="py-2 pr-4">地區一般住院、專科門診</td>
              <td className="py-2 pr-4">50 元</td>
              <td className="py-2 pr-4">80 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">區域醫院</td>
              <td className="py-2 pr-4">較複雜專科醫療、部分急重症</td>
              <td className="py-2 pr-4">100 元</td>
              <td className="py-2 pr-4">240 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">醫學中心</td>
              <td className="py-2 pr-4">急重症、罕病、教學研究、高度複雜醫療</td>
              <td className="py-2 pr-4">170 元</td>
              <td className="py-2 pr-4">420 元</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        上表反映現行分級醫療部分負擔設計：不經轉診直接到地區醫院、區域醫院、醫學中心門診，分別負擔 30%、40%、50%；經轉診者適用較低金額。實際就醫時仍以各院收據與健保署最新公告為準。
      </p>

      <h2>三個常見情境怎麼選</h2>

      <h3>情境一：假日發燒、喉嚨痛，沒有慢性病史</h3>
      <p>
        優先選擇住家附近的<strong>基層診所</strong>。診所具備第一線處理能力，部分負擔 50 元，等候時間通常也短於醫院急診。若診所判定需要進一步檢查，再由醫師協助轉診。
      </p>

      <h3>情境二：診所醫師懷疑需要心臟超音波或電腦斷層</h3>
      <p>
        請醫師開立<strong>轉診單</strong>。持轉診單至區域醫院或醫學中心，部分負擔低於自行掛號；轉診單自開立日起 90 日內有效，當次就醫可減免部分負擔。tw16.net 的院所資料庫可以按縣市、區域、科別篩選，幫你找到轉診目的地附近的醫院。
      </p>

      <h3>情境三：突發胸痛、意識改變、大量出血</h3>
      <p>
        <strong>直接撥打 119 或前往最近具急診能力的醫院</strong>。此時不需要先經診所轉診；急診檢傷分類會依病情急迫度決定處置順序，而非到達先後。
      </p>

      <h2>轉診單怎麼用，才不會白跑一趟</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>轉診單自開立日起 90 日內有效，逾期視同未經轉診。</li>
        <li>原則上應依轉診單上指定的院所與科別就醫，變更前先與原醫師討論。</li>
        <li>轉診是雙向的：病情穩定後，醫院可能將你轉回原診所繼續追蹤。</li>
        <li>轉診單不是「通行證」，而是醫療分流的專業安排；急重症不受此限。</li>
      </ul>
    </>
  ),
};