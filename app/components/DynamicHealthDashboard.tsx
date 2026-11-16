"use client";

import dynamic from "next/dynamic";

const HealthDashboard = dynamic(
  () => import("./HealthDashboard").then((mod) => mod.HealthDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 max-w-5xl mx-auto px-6 w-full animate-pulse bg-slate-100 rounded-3xl mb-8"></div>
    ),
  }
);

export function DynamicHealthDashboard() {
  return <HealthDashboard />;
}