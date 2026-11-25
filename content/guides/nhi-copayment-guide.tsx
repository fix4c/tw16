import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      部分負擔是健保制度裡「使用者付一部分」的設計，不是保費。這篇指南整理門診、急診、住院與藥品四類部分負擔的計算原則，說明哪些情況可以免除，以及拿到收據時怎麼核對。
    </p>
  ),
  highlights: [
    '門診部分負擔依院所層級與是否經轉診而定：診所 50 元，未經轉診至醫學中心為 420 元，經轉診則為 170 元。',
    '藥品部分負擔按藥費分段計算，慢性病連續處方箋的藥費免部分負擔。',
    '重大傷病、分娩、預防保健、低收入戶等情形可免部分負擔；實際認定以健保署公告為準。',
  ],
  body: (
    <>
      <h2>部分負擔不是保費</h2>
      <p>
        健保費是每月繳的保險費，部分負擔是就醫時自己付的那一段。兩者不同，收據上會分開列示。部分負擔的設計是為了避免醫療資源浪費，同時讓民眾對醫療費用有基本感受。
      </p>

      <h2>門診基本部分負擔</h2>
      <p>依院所層級與是否持轉診單就醫而不同：</p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">層級</th>
              <th className="py-2 pr-4">經轉診</th>
              <th className="py-2 pr-4">未經轉診</th>
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
        此為西醫門診基本部分負擔；中醫、牙醫另有規定，實際金額以健保署公告與各院收據為準。
      </p>

      <h2>急診部分負擔</h2>
      <p>
        急診部分負擔按醫院層級另計，金額高於門診。此外，經檢傷分類為第 4、5 級（非緊急）者，部分負擔另有加成規定，目的是引導非緊急狀況改走門診。實際金額依健保署當年度公告。
      </p>
      <p>
        若症狀不急，先至診所或門診就醫，費用與等待時間通常都比急診合理。
      </p>

      <h2>住院部分負擔</h2>
      <p>
        住院部分負擔按「病房別」與「住院天數」採不同百分比計算，急性病房與慢性病房的比例不同，且設有<strong>年度上限</strong>。超過上限的部分由健保吸收，不需要民眾再負擔。
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>急性病房：住院天數越長，部分負擔比例越高。</li>
        <li>慢性病房：比例另計，通常低於急性病房。</li>
        <li>年度上限：每年依公告調整，可在健保署網站查詢當年度金額。</li>
      </ul>

      <h2>藥品部分負擔</h2>
      <p>門診藥品部分負擔按藥費分段計算：</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>藥費在一定金額以下：免部分負擔。</li>
        <li>中段金額：按比例計算，設有單次上限。</li>
        <li>高段金額：以定額計收。</li>
        <li>慢性病連續處方箋的藥費：<strong>免部分負擔</strong>。</li>
      </ul>
      <p className="text-sm text-slate-500">
        分段金額與上限以健保署最新公告為準；藥品部分負擔與門診基本部分負擔是兩筆，收據上會分開列。
      </p>

      <h2>哪些情況可以免部分負擔</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>重大傷病（經核定且與該傷病相關的治療）。</li>
        <li>分娩。</li>
        <li>預防保健服務（如成人健檢、癌症篩檢、兒童預防保健）。</li>
        <li>低收入戶、中低收入戶等符合規定的身分。</li>
        <li>慢性病連續處方箋的藥費。</li>
        <li>其他依健保署公告的免除情形。</li>
      </ul>
      <p>
        是否符合免除資格，以健保署與醫療院所的實際認定為準；不確定時可在批價時主動詢問。
      </p>

      <h2>拿到收據怎麼看</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>收據上會分別列出「部分負擔」、「自費項目」與「掛號費」。</li>
        <li>部分負擔是健保規定的定額或比例；自費項目是健保不給付、須另付的處置或藥品。</li>
        <li>對金額有疑問時，可向醫院批價櫃檯或健保署各分區業務組詢問。</li>
      </ul>
    </>
  ),
};