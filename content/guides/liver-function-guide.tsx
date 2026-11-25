import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      肝功能檢查是最常見的抽血項目之一，但「肝功能正常」不等於肝臟完全沒問題。這篇指南說明 AST、ALT、GGT、膽紅素等常見指標的意義、常見的偏高原因，以及什麼情況該看胃腸肝膽科。
    </p>
  ),
  highlights: [
    'AST、ALT 反映肝細胞是否受損；GGT 與鹼性磷酸酶（ALP）較反映膽道系統。',
    '輕微偏高不一定代表肝病，可能與脂肪肝、飲酒、藥物、肌肉運動有關。',
    '各實驗室參考區間不同，報告上的「紅字」意義以該院報告為準；異常應由醫師搭配病史判讀。',
  ],
  body: (
    <>
      <h2>常見肝功能指標</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">指標</th>
              <th className="py-2 pr-4">主要反映</th>
              <th className="py-2 pr-4">常見偏高原因</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">AST（GOT）</td>
              <td className="py-2 pr-4">肝細胞、心肌、骨骼肌</td>
              <td className="py-2 pr-4">肝炎、脂肪肝、飲酒、肌肉運動、心肌傷害</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">ALT（GPT）</td>
              <td className="py-2 pr-4">肝細胞（較具特異性）</td>
              <td className="py-2 pr-4">肝炎、脂肪肝、藥物</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">GGT</td>
              <td className="py-2 pr-4">膽道、肝臟</td>
              <td className="py-2 pr-4">飲酒、膽道疾病、藥物</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">ALP（鹼性磷酸酶）</td>
              <td className="py-2 pr-4">膽道、骨骼</td>
              <td className="py-2 pr-4">膽道阻塞、骨骼疾病、懷孕</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">總膽紅素</td>
              <td className="py-2 pr-4">紅血球代謝、肝臟處理</td>
              <td className="py-2 pr-4">溶血、肝病、膽道阻塞</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">白蛋白</td>
              <td className="py-2 pr-4">肝臟製造蛋白質的能力</td>
              <td className="py-2 pr-4">肝硬化、營養不良、腎病</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        各實驗室參考區間不同，報告上的數值與「紅字」意義以該院報告為準。
      </p>

      <h2>AST 與 ALT 一起看</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>ALT 較具肝臟特異性</strong>：ALT 升高通常較能反映肝細胞受損。</li>
        <li><strong>AST/ALT 比值</strong>：酒精性肝病常見 AST 高於 ALT；病毒性肝炎或脂肪肝則多以 ALT 為主。</li>
        <li><strong>AST 也來自肌肉</strong>：劇烈運動、肌肉受傷也會讓 AST 升高，需搭配其他指標。</li>
      </ul>

      <h2>輕微偏高常見原因</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>非酒精性脂肪肝：與體重、代謝症候群相關，是最常見的原因之一。</li>
        <li>飲酒：即使不是大量飲酒，長期累積也可能影響。</li>
        <li>藥物或保健食品：部分止痛藥、降血脂藥、中藥與草藥可能影響肝功能。</li>
        <li>近期劇烈運動。</li>
        <li>病毒感染（如感冒、腸胃炎）。</li>
      </ul>
      <p>
        輕微偏高不等於肝病，通常會建議<strong>間隔數週至數月複檢</strong>，搭配病史與其他檢查判讀。
      </p>

      <h2>什麼情況需要盡速就醫</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>ALT 或 AST 明顯偏高（超過參考上限數倍）。</li>
        <li>伴隨黃疸（皮膚、眼白變黃）、茶色尿、灰白便。</li>
        <li>右上腹痛、噁心、嘔吐、食慾明顯下降。</li>
        <li>意識變化、容易出血（可能與肝功能嚴重受損有關）。</li>
      </ul>
      <p>
        上述情況建議盡速至<strong>胃腸肝膽科</strong>或急診評估。
      </p>

      <h2>看報告時可以搭配什麼</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>B 型、C 型肝炎篩檢。</li>
        <li>腹部超音波：評估脂肪肝、肝硬化、膽結石。</li>
        <li>飲酒史、用藥史、保健食品使用情形。</li>
        <li>體重、腰圍、血糖與血脂（代謝症候群相關）。</li>
      </ul>
    </>
  ),
};