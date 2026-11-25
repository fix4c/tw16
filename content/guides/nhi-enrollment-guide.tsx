import type { GuideContent } from '@/lib/guides/types';

export const content: GuideContent = {
  intro: (
    <p>
      換工作、離職、待業、成為眷屬，每一種身分變動都會影響健保的投保方式。這篇指南整理不同身分下的加保方式、轉出轉入流程、眷屬加保條件，以及中斷投保可能的影響。
    </p>
  ),
  highlights: [
    '受僱者由公司加保；離職後須辦理轉出，再依新身分（新公司、眷屬、地區人口、工會）加保。',
    '眷屬加保的條件與順序有規定；被保險人不得同時以多種身分重複投保。',
    '中斷投保期間若就醫，可能需補繳保費或先自費再依規定處理。',
  ],
  body: (
    <>
      <h2>常見投保身分</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>受僱者</strong>：由公司（投保單位）辦理加保。</li>
        <li><strong>眷屬</strong>：依附在配偶、直系血親或子女名下加保。</li>
        <li><strong>職業工會會員</strong>：無一定雇主或自營作業者，可透過所屬職業工會加保。</li>
        <li><strong>地區人口</strong>：不符合前述身分者，至戶籍地鄉鎮市區公所加保（第六類）。</li>
      </ul>

      <h2>換工作：轉出與轉入</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>離職時，原公司會辦理<strong>轉出</strong>。</li>
        <li>到新公司報到後，新公司會辦理<strong>轉入</strong>。</li>
        <li>若新舊工作之間有空檔，需先以其他身分（如眷屬、地區人口）接續投保，避免中斷。</li>
      </ul>
      <p>
        同一月份在兩家公司投保時，重複的保費可依規定辦理退費或抵扣，實際作業依健保署規定。
      </p>

      <h2>離職、待業期間怎麼保</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>眷屬身分</strong>：配偶或直系血親有工作時，可依附其加保。</li>
        <li><strong>地區人口</strong>：至戶籍地公所加保（第六類）。</li>
        <li><strong>職業工會</strong>：若為無一定雇主者，可透過工會加保。</li>
      </ul>
      <p>
        待業期間不建議放著不管，中斷投保可能影響就醫權益與後續保費計算。
      </p>

      <h2>眷屬加保的條件</h2>
      <p>可依附被保險人加保的眷屬包括：</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>無職業的配偶。</li>
        <li>無職業的直系血親尊親屬（如父母、祖父母）。</li>
        <li>無職業的子女（含收養），未成年或已成年但無工作能力者。</li>
      </ul>
      <p>
        眷屬以依附<strong>一位</strong>被保險人為限，不得重複依附。若同時符合多個被保險人的眷屬身分，依規定選擇其一。
      </p>

      <h2>中斷投保的影響</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>中斷期間若就醫，可能需先自費，之後再依規定申請核退。</li>
        <li>健保署會依規定追繳中斷期間的保費。</li>
        <li>長期未處理可能影響後續加保與相關給付權益。</li>
      </ul>

      <h2>怎麼查自己的投保狀態</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>健保快易通 APP：可查投保紀錄與異動。</li>
        <li>健保署網站：以自然人憑證或註冊帳號查詢。</li>
        <li>電話洽詢健保署各分區業務組。</li>
        <li>向目前或前任投保單位確認。</li>
      </ul>
    </>
  ),
};