-- 评论统计表
CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  good_count  INTEGER NOT NULL DEFAULT 0,
  bad_count   INTEGER NOT NULL DEFAULT 0
);

-- 逐票记录表（防同一指纹重复投票）
CREATE TABLE IF NOT EXISTS user_votes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  clinic_name TEXT NOT NULL,
  user_email  TEXT NOT NULL,           -- 实际存 fingerprint
  vote_type   TEXT NOT NULL CHECK(vote_type IN ('good','bad')),
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(clinic_name, user_email)
);

CREATE INDEX IF NOT EXISTS idx_user_votes_clinic ON user_votes(clinic_name);