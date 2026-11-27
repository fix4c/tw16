-- 建立 reviews 表（存储总投票数）
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  good_count INTEGER DEFAULT 0,
  bad_count INTEGER DEFAULT 0
);

-- 建立 user_votes 表（记录用户指纹防刷票）
CREATE TABLE IF NOT EXISTS user_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clinic_name TEXT,
  user_email TEXT,
  vote_type TEXT
);