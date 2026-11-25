import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      產檢是孕期最重要的健康管理。這篇指南整理產檢時程、各階段常見檢查項目、就醫前準備，以及孕婦就醫時應主動告知的事項。實際產檢次數與項目依醫師評估與健保給付規定調整。
    </p>
  ),
  highlights: [
    '健保提供 14 次產檢補助（依現行規定），實際依孕婦狀況與醫師建議安排。',
    '產檢時應主動告知：慢性病、目前用藥、過敏史、過去孕產史。',
    '出現陰道出血、劇烈腹痛、持續頭痛或視力模糊、胎動明顯減少，應立即就醫。',
  ],
  body: (
    <>
      <h2>產檢的基本概念</h2>
      <p>
        產檢的目的是監測孕婦與胎兒的健康，及早發現並處理可能的併發症。產檢頻率通常依孕期進展增加：
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>懷孕初期至 28 週：約每 4 週一次。</li>
        <li>28–36 週：約每 2 週一次。</li>
        <li>36 週後：約每週一次。</li>
      </ul>
      <p className="text-sm text-slate-500">
        實際頻率依孕婦狀況、醫師評估與健保給付規定調整，高風險妊娠可能需要更密集的追蹤。
      </p>

      <h2>各階段常見檢查</h2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">孕期</th>
              <th className="py-2 pr-4">常見檢查</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">初期（至 12 週）</td>
              <td className="py-2 pr-4">確認懷孕、基礎血液檢查、尿液檢查、超音波、德國麻疹抗體、B 肝 C 肝篩檢</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">中期（13–28 週）</td>
              <td className="py-2 pr-4">唐氏症篩檢或 NIPT、高層次超音波、妊娠糖尿病篩檢、子癇前症風險評估</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4">後期（29 週後）</td>
              <td className="py-2 pr-4">胎位、胎盤位置、胎兒生長評估、乙型鏈球菌篩檢、胎動監測</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        實際檢查項目依醫師評估與健保給付規定調整；部分檢查為自費項目，處置前應確認金額與必要性。
      </p>

      <h2>產檢前的準備</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>孕婦健康手冊</strong>：每次產檢都要帶。</li>
        <li><strong>健保卡</strong>與相關證件。</li>
        <li><strong>目前用藥</strong>：包含處方藥、保健食品、中藥。</li>
        <li><strong>症狀紀錄</strong>：胎動、出血、腹痛、水腫、頭痛等。</li>
        <li><strong>想問的問題</strong>：先寫下來，避免看診時忘記。</li>
      </ul>

      <h2>產檢時應主動告知的事項</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>慢性病史（如高血壓、糖尿病、甲狀腺疾病）。</li>
        <li>目前正在服用的藥物。</li>
        <li>藥物或食物過敏史。</li>
        <li>過去孕產史：流產、早產、剖腹產、併發症等。</li>
        <li>家族史：遺傳疾病、糖尿病、高血壓等。</li>
        <li>生活型態：吸菸、飲酒、工作型態。</li>
      </ul>

      <h2>孕期需要立即就醫的警訊</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>陰道出血</strong>（量多、持續或合併腹痛）。</li>
        <li><strong>劇烈腹痛</strong>或持續子宮收縮。</li>
        <li><strong>持續頭痛、視力模糊、上腹痛</strong>（可能與子癇前症有關）。</li>
        <li><strong>胎動明顯減少或消失</strong>。</li>
        <li><strong>破水</strong>：陰道流出清澈液體。</li>
        <li><strong>發燒、呼吸困難、嚴重水腫</strong>。</li>
        <li><strong>嚴重嘔吐、無法進食</strong>（可能造成脫水）。</li>
      </ul>
      <p>
        出現上述任一情況，應立即聯絡產檢院所或就醫，不要等到下次產檢。
      </p>

      <h2>孕期用藥的基本原則</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>任何藥物（含成藥、中藥、保健食品）使用前應先諮詢醫師或藥師。</li>
        <li>不要自行停用慢性病用藥，應與醫師討論孕期安全用藥。</li>
        <li>接種疫苗前應告知醫師懷孕狀況，由醫師評估。</li>
      </ul>
    </>
  ),
};