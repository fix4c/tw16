import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      急診不是「比較快的門診」，而是處理立即危及生命或可能造成永久傷害的狀況。這篇指南說明哪些症狀應該直接送急診、五級檢傷分類怎麼運作、非緊急狀況去急診的代價，以及什麼情況該打 119。
    </p>
  ),
  highlights: [
    '出現胸痛、呼吸困難、意識改變、大量出血、抽搐、嚴重外傷、中風徵兆，直接撥打 119 或送急診，不需要先經診所轉診。',
    '急診採五級檢傷分類，依病情急迫度決定看診順序，與到達先後無關；第 4、5 級非緊急個案等待時間可能更長。',
    '非緊急狀況到急診，部分負擔高於門診，且可能排擠真正急重症的醫療資源。',
  ],
  body: (
    <>
      <h2>立即送急診的警訊</h2>
      <p>出現下列任一情況，請直接撥打 119 或前往最近具急診能力的醫院：</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>持續胸痛、胸悶，合併冒冷汗、呼吸困難，或疼痛放射至左肩、下巴。</li>
        <li>突然的單側無力、臉部歪斜、口齒不清、視力模糊（中風徵兆）。</li>
        <li>意識改變、昏迷、抽搐、劇烈頭痛合併嘔吐。</li>
        <li>呼吸困難、嘴唇發紫、嚴重氣喘發作。</li>
        <li>大量出血、嚴重外傷、大面積燒燙傷、高處墜落。</li>
        <li>嚴重過敏反應（呼吸困難、全身蕁麻疹、意識不清）。</li>
        <li>持續嘔吐或腹瀉合併脫水、意識變化。</li>
      </ul>

      <h2>兒童急診警訊</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>高燒合併活動力明顯下降、意識不清、抽搐。</li>
        <li>呼吸急促、鼻翼搧動、胸凹（吸氣時肋骨下方凹陷）。</li>
        <li>持續嘔吐、無法進食、尿量明顯減少。</li>
        <li>膚色發紺或蒼白、四肢冰冷。</li>
      </ul>
      <p>
        兒童急症應送往具兒科急診能力的醫院，必要時先電話確認。
      </p>

      <h2>五級檢傷分類怎麼運作</h2>
      <p>
        急診依「檢傷分類」決定處置順序，而非到達先後。台灣採用五級分類，由護理師在病人到院時依生命徵象與主訴判定：
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">級別</th>
              <th className="py-2 pr-4">意義</th>
              <th className="py-2 pr-4">常見情況（舉例）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 1 級</td>
              <td className="py-2 pr-4">復甦急救</td>
              <td className="py-2 pr-4">心跳停止、休克、嚴重創傷</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 2 級</td>
              <td className="py-2 pr-4">危急</td>
              <td className="py-2 pr-4">疑似中風、急性胸痛、嚴重的呼吸困難</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 3 級</td>
              <td className="py-2 pr-4">緊急</td>
              <td className="py-2 pr-4">中度疼痛、發燒合併其他症狀</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 4 級</td>
              <td className="py-2 pr-4">次緊急</td>
              <td className="py-2 pr-4">輕度外傷、單純感冒症狀</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">第 5 級</td>
              <td className="py-2 pr-4">非緊急</td>
              <td className="py-2 pr-4">慢性問題、輕微不適</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        第 1、2 級會優先處置；第 3 級視現場量能安排；第 4、5 級的等待時間可能相當長，且部分負擔另有加成規定。實際分級與等待時間以各院急診現場為準。
      </p>

      <h2>非緊急狀況去急診的代價</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>等待時間長：醫護優先處理急重症，非緊急個案可能等數小時。</li>
        <li>部分負擔較高：急診部分負擔高於門診，第 4、5 級另有加成。</li>
        <li>排擠資源：每一張非緊急的急診病床，都可能是真正急重症病人需要的。</li>
      </ul>
      <p>
        若症狀不急，先至診所或門診就醫，通常更快、更便宜，也能獲得完整處置。
      </p>

      <h2>什麼情況該打 119</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>疑似中風、心肌梗塞：救護車可在送醫途中通報醫院準備。</li>
        <li>意識不清、抽搐、嚴重呼吸困難。</li>
        <li>嚴重外傷、大量出血、高處墜落。</li>
        <li>病人無法自行移動，或自行開車就醫反而有風險。</li>
      </ul>
      <p>
        119 不需要付費；若非緊急狀況，可自行就醫，把救護資源留給真正需要的人。
      </p>
    </>
  ),
};