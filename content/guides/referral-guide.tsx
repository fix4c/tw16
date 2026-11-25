import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      轉診不是「看不好才轉」，而是醫療體系裡把病人送到最適合層級的安排。這篇指南說明什麼情況需要轉診、轉診單怎麼拿與怎麼用、90 天期限怎麼算，以及經轉診與自行前往在部分負擔上的實際差距。
    </p>
  ),
  highlights: [
    '轉診單由醫師開立，自開立日起 90 日內有效；當次就醫可享較低的部分負擔。',
    '經轉診至醫學中心門診的部分負擔約 170 元，未經轉診自行前往約 420 元；區域醫院則是 100 元與 240 元。',
    '急重症不需要先經診所轉診，直接撥打 119 或前往最近具急診能力的醫院。',
  ],
  body: (
    <>
      <h2>什麼是轉診？為什麼要有轉診</h2>
      <p>
        轉診是醫師依病情需要，把病人轉到另一層級或另一科別院所繼續處置的過程。健保的「分級醫療」設計，希望常見疾病在基層診所處理、複雜疾病由醫院承接，透過轉診維持醫療資源的合理使用，也讓病人少繞路。
      </p>
      <p>
        轉診是<strong>雙向</strong>的：診所可以把病人轉到醫院，醫院也可以在病情穩定後把病人轉回原診所繼續追蹤。
      </p>

      <h2>什麼情況需要轉診</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>基層診所判斷需要專科檢查（例如心臟超音波、電腦斷層、內視鏡）。</li>
        <li>需要手術評估、住院，或高度複雜的處置。</li>
        <li>病情在診所處理後未改善，需要進一步鑑別診斷。</li>
      </ul>
      <p>
        反過來說，一般感冒、慢性病追蹤、輕微外傷、單純的皮膚問題，診所就能處理，不需要為此轉診到大醫院。
      </p>

      <h2>轉診單怎麼拿、怎麼用</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>由看診醫師依專業判斷開立，不是病人自行索取。</li>
        <li>自開立日起 <strong>90 日內有效</strong>，逾期視同未經轉診。</li>
        <li>原則上應依轉診單上指定的院所與科別就醫；若想更改，先與原醫師討論。</li>
        <li>轉診單不是「通行證」，而是醫療分流的專業安排；急重症不受此限。</li>
      </ul>

      <h2>經轉診與未經轉診的部分負擔差多少</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">就醫層級</th>
              <th className="py-2 pr-4">經轉診（門診部分負擔）</th>
              <th className="py-2 pr-4">未經轉診（門診部分負擔）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">基層診所</td>
              <td className="py-2 pr-4">50 元</td>
              <td className="py-2 pr-4">50 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">地區醫院</td>
              <td className="py-2 pr-4">50 元</td>
              <td className="py-2 pr-4">80 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">區域醫院</td>
              <td className="py-2 pr-4">100 元</td>
              <td className="py-2 pr-4">240 元</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">醫學中心</td>
              <td className="py-2 pr-4">170 元</td>
              <td className="py-2 pr-4">420 元</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        金額以現行健保部分負擔規定整理，實際就醫以各院收據與健保署最新公告為準。
      </p>

      <h2>轉診後的三種走向</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>留在醫院治療</strong>：需要手術、住院或密集處置時。</li>
        <li><strong>轉回原診所</strong>：檢查完成、病情穩定後，由醫院開立轉診單回基層繼續追蹤。</li>
        <li><strong>轉至其他專科</strong>：由原醫師依病情安排，例如從心臟內科轉到心臟外科評估手術。</li>
      </ul>

      <h2>需要急診時，不需要先轉診</h2>
      <p>
        突發胸痛、意識改變、大量出血、嚴重外傷、抽搐等急症，請直接撥打 119 或前往最近具急診能力的醫院。急診的處置順序由檢傷分類決定，與有沒有轉診單無關。
      </p>
    </>
  ),
};