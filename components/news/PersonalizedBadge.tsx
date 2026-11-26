'use client';

import { useEffect, useState } from 'react';
import {
  getRelatedConditions,
  HEALTH_CONDITION_LABELS,
  type HealthCondition,
} from '@/lib/news';

type Props = {
  title: string;
  summary: string;
};

/**
 * 讀取使用者健康看板記錄，若新聞與記錄的健康狀況相關，顯示提示標籤。
 * 未記錄任何健康狀況時，不顯示任何內容。
 */
export function PersonalizedBadge({ title, summary }: Props) {
  const [related, setRelated] = useState<HealthCondition[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tw16-health-conditions');
      const conditions: HealthCondition[] = raw ? JSON.parse(raw) : [];
      if (conditions.length === 0) return;
      setRelated(getRelatedConditions(title, summary, conditions));
    } catch {
      // 忽略解析錯誤
    }
  }, [title, summary]);

  if (related.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
      ⚠️ 與您記錄的「
      {related.map((c) => HEALTH_CONDITION_LABELS[c]).join('、')}
      」相關
    </span>
  );
}