'use client';

type DataPoint = { date: string; value: number };

export function TrendChart({ data, label, unit }: { data: DataPoint[]; label: string; unit: string }) {
  if (data.length < 2) {
    return <p className="text-sm text-slate-400">记录至少 2 笔数据后，这里会显示趋势。</p>;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 320;
  const height = 120;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-2 text-sm font-bold text-slate-700">{label}趋势（{unit}）</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <polyline points={points} fill="none" stroke="#0d9488" strokeWidth="2" />
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
          return <circle key={i} cx={x} cy={y} r="3" fill="#0d9488" />;
        })}
      </svg>
      <p className="mt-1 text-xs text-slate-400">
        范围 {min}–{max} {unit} · 共 {data.length} 笔记录
      </p>
    </div>
  );
}