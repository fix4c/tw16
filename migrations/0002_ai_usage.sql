-- AI 額度與持久快取（與 0001_init.sql 的 reviews / user_votes 共存）

-- 全站每日調用計數
CREATE TABLE IF NOT EXISTS ai_daily_global (
  day  TEXT PRIMARY KEY,           -- 'YYYY-MM-DD'（UTC）
  used INTEGER NOT NULL DEFAULT 0
);

-- 每 IP 每日計數（IP 以 SHA-256 雜湊儲存，不存原文）
CREATE TABLE IF NOT EXISTS ai_daily_ip (
  day     TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  used    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, ip_hash)
);

-- 症狀→結果 持久快取
CREATE TABLE IF NOT EXISTS ai_symptom_cache (
  cache_key   TEXT PRIMARY KEY,    -- sha256(正規化後的症狀文字)
  result_json TEXT NOT NULL,
  created_at  INTEGER NOT NULL,    -- Unix 秒
  expires_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_symptom_cache_expires
  ON ai_symptom_cache(expires_at);

-- 降級日誌（方便日後調額度）
CREATE TABLE IF NOT EXISTS ai_degrade_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  day        TEXT NOT NULL,
  reason     TEXT NOT NULL,        -- 'global_quota' | 'ip_quota' | 'gemini_fail'
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_degrade_log_day
  ON ai_degrade_log(day);