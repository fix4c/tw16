import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      看診後拿到處方箋，領藥是療程中最容易被忽略的一步。藥袋上的資訊、藥品的保存、服用方式與可能副作用，都是領藥時該確認的事。這篇指南整理從拿到處方箋到把藥吃對的完整流程。
    </p>
  ),
  highlights: [
    '領藥時必核對：姓名、藥名、劑量、用法、天數、院所名稱。',
    '藥袋上的警語與副作用說明要看；有疑問當場問藥師，不要回家才想。',
    '同時服用多種藥物、保健食品或中藥時，應主動告知藥師與醫師。',
  ],
  body: (
    <>
      <h2>拿到處方箋後</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>院內藥局</strong>：看診後直接至批價、領藥窗口。</li>
        <li><strong>健保特約藥局</strong>：持處方箋至住家附近藥局領藥，較有彈性。</li>
        <li><strong>慢箋</strong>：分次領藥，依處方箋上的領藥時間辦理。</li>
      </ul>

      <h2>領藥時必核對的 6 件事</h2>
      <ol className="list-decimal space-y-1 pl-6">
        <li><strong>姓名</strong>：藥袋上的名字是你的嗎？</li>
        <li><strong>藥名與外觀</strong>：藥品名稱、顏色、形狀與藥袋描述一致嗎？</li>
        <li><strong>劑量</strong>：每次幾顆、一天幾次。</li>
        <li><strong>用法</strong>：飯前、飯後、睡前、需要時使用。</li>
        <li><strong>天數</strong>：這次開幾天，是否與預期一致。</li>
        <li><strong>院所與醫師</strong>：確認是本次就醫的處方。</li>
      </ol>
      <p>
        任何一項不對，**當場向藥師反映**，不要回家才發現。領藥窗口是最後一道把關。
      </p>

      <h2>藥袋上的資訊怎麼看</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>主要適應症</strong>：這個藥是要處理什麼問題。</li>
        <li><strong>用法用量</strong>：與醫師口頭說明是否一致。</li>
        <li><strong>副作用</strong>：常見與需注意的副作用，以及出現時該怎麼做。</li>
        <li><strong>警語</strong>：例如「服藥後避免開車」、「避免與葡萄柚汁併服」、「可能造成嗜睡」。</li>
        <li><strong>保存方式</strong>：室溫、避光、冷藏與否。</li>
      </ul>

      <h2>自費藥品與健保給付</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>健保給付的藥品，民眾只需付部分負擔。</li>
        <li>自費藥品須全額自付；醫師開立前應說明原因與金額。</li>
        <li>若同時有健保與自費藥品，可請藥師標示清楚。</li>
      </ul>

      <h2>用藥時的主動告知</h2>
      <p>下列情況，領藥或看診時應主動告知醫師與藥師：</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>目前正在服用的其他藥物（含中藥、保健食品）。</li>
        <li>藥物或食物過敏史。</li>
        <li>懷孕、備孕或哺乳。</li>
        <li>肝臟或腎臟疾病（影響藥物代謝）。</li>
        <li>正在服用抗凝血劑、降血糖藥等交互作用風險較高的藥物。</li>
      </ul>

      <h2>吃藥的基本原則</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>依醫囑服用，不要自行增減劑量或停藥。</li>
        <li>抗生素等需完成療程的藥物，即使症狀改善也要吃完。</li>
        <li>忘記服藥時，依藥袋說明處理，不要一次吃兩倍。</li>
        <li>出現嚴重不良反應（呼吸困難、全身皮疹、意識變化），應立即就醫。</li>
      </ul>
    </>
  ),
};