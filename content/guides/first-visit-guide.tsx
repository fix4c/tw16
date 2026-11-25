import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      第一次到一家診所或醫院看診，最常發生的不是醫療問題，而是「證件沒帶、資料不齊、不知道流程」。這篇指南整理初診要帶什麼、要準備什麼、到院後怎麼走，以及哪些費用應該先問清楚。
    </p>
  ),
  highlights: [
    '必帶：健保卡、身分證（或居留證）；初診通常還需填基本資料。',
    '建議帶：目前正在吃的藥（藥袋或藥單）、過敏史、最近檢查報告、轉診單（若有）。',
    '自費項目、自費藥品應在處置前問清楚金額，並確認是否有健保給付的替代方案。',
  ],
  body: (
    <>
      <h2>必帶證件與資料</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>健保卡</strong>：沒有健保卡仍可就醫，但需先以自費結算，後續再依規定辦理退費（詳見健保卡使用指南）。</li>
        <li><strong>身分證</strong>或居留證：初診核對身分用。</li>
        <li><strong>轉診單</strong>（若有）：持轉診單就醫可適用較低的部分負擔。</li>
        <li><strong>重大傷病證明</strong>（若適用）：與該傷病相關的治療可免部分負擔。</li>
        <li><strong>身心障礙證明</strong>（若適用）：部分掛號費或自費項目可能減免。</li>
      </ul>

      <h2>建議一起帶的醫療資訊</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>目前正在服用的所有藥物：藥袋、藥單，或直接拍照。</li>
        <li>藥物過敏史、食物過敏史。</li>
        <li>最近三個月內的其他院所檢驗或檢查報告（若有）。</li>
        <li>慢性病史、曾接受的手術。</li>
        <li>女性：最後一次月經日期（若與本次就醫相關）。</li>
      </ul>
      <p>
        這些資訊看似繁瑣，但能讓醫師在短時間內掌握狀況，避免重複檢查或開立衝突的藥物。若時常忘記，可養成將藥袋拍照存手機的習慣。
      </p>

      <h2>到院後的基本流程</h2>
      <ol className="list-decimal space-y-1 pl-6">
        <li><strong>掛號</strong>：網路、電話或現場掛號。初診通常需填寫基本資料與病史表。</li>
        <li><strong>候診</strong>：依燈號或叫號系統等候；部分院所有 APP 可查即時進度。</li>
        <li><strong>看診</strong>：主動告知主要症狀、持續時間、已嘗試的處置與用藥。</li>
        <li><strong>批價</strong>：確認部分負擔、自費項目與掛號費。</li>
        <li><strong>領藥</strong>：核對藥袋上的姓名、藥名、劑量與用法。</li>
      </ol>

      <h2>看診時怎麼說，醫師比較聽得懂</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>主要症狀</strong>：什麼時候開始、怎麼開始、有沒有變化。</li>
        <li><strong>伴隨症狀</strong>：發燒、噁心、體重變化、食慾等。</li>
        <li><strong>已做過的處置</strong>：吃過什麼藥、看過哪一科、做過什麼檢查。</li>
        <li><strong>最在意的事</strong>：是疼痛難耐、影響工作，還是擔心某個嚴重疾病。</li>
      </ul>
      <p>
        不必一次講完所有細節，先講最困擾的症狀，醫師會依需要追問。若怕忘記，可先在手機備忘錄列 3–5 點。
      </p>

      <h2>費用要先問清楚</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>掛號費</strong>：各院所自訂，非健保給付範圍。</li>
        <li><strong>部分負擔</strong>：依層級與是否轉診而定，收據上會列示。</li>
        <li><strong>自費項目</strong>：健保不給付的檢查、藥品、醫材。處置前應先確認金額，並詢問是否有健保給付的替代方案。</li>
      </ul>

      <h2>看完診後</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>核對藥袋與處方：姓名、藥品、劑量、服用方式、天數。</li>
        <li>確認回診時間或需注意的警訊症狀。</li>
        <li>保留收據，必要時可作為報稅或商業保險理賠憑證。</li>
        <li>若症狀未改善或出現新症狀，應回診或依醫囑處理。</li>
      </ul>
    </>
  ),
};