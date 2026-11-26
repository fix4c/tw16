// AI 分診模組入口
// 日後新增分診相關功能（急症警示、就醫前準備清單等）統一由此匯出
export {
  getTriageReason,
  REASON_RULES,
  type TriageReasonRule,
} from "./reasons";