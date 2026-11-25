import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      尿液檢查是最常見的基礎篩檢之一，能初步反映腎臟、泌尿道與代謝狀況。這篇指南說明報告上常見的尿蛋白、尿糖、潛血、白血球等項目代表什麼、什麼情況需要複檢，以及異常時該看哪一科。
    </p>
  ),
  highlights: [
    '尿液檢查是篩檢工具，單次異常不等於疾病；常需複檢或搭配血液檢查確認。',
    '尿蛋白、尿糖、潛血是三個最常需要追蹤的項目，但影響因素多，解讀須搭配症狀與其他檢查。',
    '各實驗室參考區間不同，報告上的「+」「-」與數值意義以該院報告為準。',
  ],
  body: (
    <>
      <h2>尿液檢查在做什麼</h2>
      <p>
        尿液檢查分為「試紙法」與「顯微鏡檢查」兩部分。試紙法快速篩檢多個項目，顯微鏡則看紅血球、白血球、圓柱體等有形成分。兩者互補，通常一起做。
      </p>

      <h2>常見項目與意義</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">項目</th>
              <th className="py-2 pr-4">代表什麼</th>
              <th className="py-2 pr-4">常見影響因素</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">尿蛋白</td>
              <td className="py-2 pr-4">腎絲球或腎小管是否漏蛋白</td>
              <td className="py-2 pr-4">運動後、發燒、脫水、姿勢性蛋白尿</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">尿糖</td>
              <td className="py-2 pr-4">血糖是否過高、腎臟閾值是否改變</td>
              <td className="py-2 pr-4">糖尿病、懷孕、某些藥物</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">潛血</td>
              <td className="py-2 pr-4">尿中是否有紅血球</td>
              <td className="py-2 pr-4">泌尿道感染、結石、月經、劇烈運動</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">白血球</td>
              <td className="py-2 pr-4">是否有發炎或感染</td>
              <td className="py-2 pr-4">泌尿道感染、陰道分泌物污染</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">酮體</td>
              <td className="py-2 pr-4">身體是否以脂肪為主要能量來源</td>
              <td className="py-2 pr-4">空腹、低碳飲食、糖尿病控制不佳</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">亞硝酸鹽</td>
              <td className="py-2 pr-4">部分細菌感染的間接指標</td>
              <td className="py-2 pr-4">泌尿道感染</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        各院使用的試紙品牌與參考區間不同，報告上的「+」「-」與數值意義以該院報告為準。
      </p>

      <h2>尿蛋白：最常需要追蹤的項目</h2>
      <p>
        單次尿蛋白陽性不一定代表腎臟病。常見的暫時性原因包括：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>劇烈運動後、發燒、脫水。</li>
        <li>長時間站立或行走（姿勢性蛋白尿）。</li>
        <li>泌尿道感染。</li>
      </ul>
      <p>
        若複檢仍持續陽性，或伴隨水腫、泡泡尿久不消散，建議至<strong>腎臟科</strong>進一步評估，可能需要檢驗尿液蛋白/肌酸酐比值（UPCR）或 24 小時尿蛋白。
      </p>

      <h2>尿糖：不只看糖尿病</h2>
      <p>
        尿糖陽性通常反映血糖超過腎臟再吸收的閾值（約 180 mg/dL），但閾值因人而異。可能原因包括：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>糖尿病或糖尿病前期。</li>
        <li>懷孕（腎臟閾值下降）。</li>
        <li>某些藥物（如 SGLT2 抑制劑會刻意讓尿糖排出）。</li>
        <li>短時間大量攝取糖分。</li>
      </ul>
      <p>
        尿糖陽性建議搭配<strong>空腹血糖與糖化血色素</strong>確認，不建議單憑尿糖判斷。
      </p>

      <h2>潛血：要看有沒有紅血球</h2>
      <p>
        試紙潛血陽性可能是真正的血尿，也可能是血紅素或肌紅素干擾。應搭配顯微鏡檢查確認是否有紅血球。常見原因：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>泌尿道感染、結石。</li>
        <li>月經污染（女性）。</li>
        <li>劇烈運動後。</li>
        <li>腎臟或泌尿道腫瘤（較少見，但需排除）。</li>
      </ul>
      <p>
        無症狀的顯微性血尿，建議至<strong>腎臟科</strong>或<strong>泌尿科</strong>評估，依年齡與風險決定是否進一步影像檢查。
      </p>

      <h2>採檢注意事項</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>通常取中段尿，避免前段尿被汙染。</li>
        <li>女性避開月經期間採檢。</li>
        <li>採檢前避免劇烈運動。</li>
        <li>容器保持清潔，採檢後盡速送檢。</li>
      </ul>
    </>
  ),
};