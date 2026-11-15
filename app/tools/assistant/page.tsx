"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../../components/Header"; 

type Step = {
  question: string;
  options: {
    label: string;
    nextStep?: string;
    result?: {
      title: string;
      advice: string;
      departments: string[];
      isEmergency?: boolean;
    };
  }[];
};

const flowData: Record<string, Step> = {
  start: {
    question: "請問您哪裡不舒服？",
    options: [
      { label: "發燒 / 全身痠痛", nextStep: "fever" },
      { label: "咳嗽 / 流鼻涕 / 喉嚨痛", nextStep: "respiratory" },
      { label: "肚子痛 / 腸胃不適", nextStep: "stomach" },
      { label: "頭痛 / 頭暈", nextStep: "head" },
      { label: "胸悶 / 心悸 / 喘", nextStep: "chest" },
      { label: "皮膚起疹子 / 癢", nextStep: "skin" },
    ],
  },
  fever: {
    question: "您的發燒狀況是？",
    options: [
      { 
        label: "發燒超過 3 天，或伴隨呼吸困難", 
        result: { 
          title: "建議盡速就醫", 
          advice: "持續高燒或伴隨呼吸急促，可能為較嚴重的感染，請盡快到醫院急診或感染科、胸腔內科就診。", 
          departments: ["感染科", "胸腔內科", "急診"],
          isEmergency: true
        } 
      },
      { 
        label: "剛開始發燒，只有輕微痠痛", 
        result: { 
          title: "建議至診所或家醫科", 
          advice: "多數輕微發燒為一般感冒或病毒感染，可先至附近診所或家醫科由醫師評估。", 
          departments: ["家醫科", "一般內科", "小兒科(兒童)"]
        } 
      },
    ],
  },
  respiratory: {
    question: "您的症狀持續多久了？",
    options: [
      { 
        label: "咳嗽超過兩週，或伴隨咳血", 
        result: { 
          title: "建議至醫院檢查", 
          advice: "慢性咳嗽或咳血需要進一步影像檢查，建議至胸腔內科或耳鼻喉科詳細評估。", 
          departments: ["胸腔內科", "耳鼻喉科"]
        } 
      },
      { 
        label: "剛開始，有痰或流鼻水", 
        result: { 
          title: "建議至診所就醫", 
          advice: "急性呼吸道症狀通常為感冒，可至附近耳鼻喉科或家醫科診所拿藥休息。", 
          departments: ["耳鼻喉科", "家醫科", "小兒科(兒童)"]
        } 
      },
    ],
  },
  stomach: {
    question: "肚子痛的位置在哪裡？",
    options: [
      { 
        label: "右上腹（右肋骨下方）", 
        result: { 
          title: "建議至胃腸肝膽科", 
          advice: "右上腹痛可能與肝膽系統有關，若伴隨發燒或黃疸，請盡速就醫。", 
          departments: ["胃腸肝膽科", "一般外科"]
        } 
      },
      { 
        label: "上腹部（胃部）", 
        result: { 
          title: "建議至胃腸科或家醫科", 
          advice: "上腹痛多為胃部發炎或消化不良。若解黑便、吐血或劇痛，請立即至急診。", 
          departments: ["胃腸肝膽科", "家醫科"]
        } 
      },
      { 
        label: "右下腹（肚臍右下方）", 
        result: { 
          title: "建議盡速就醫", 
          advice: "右下腹劇痛且按壓會痛，需排除盲腸炎可能，請盡速至急診或一般外科評估。", 
          departments: ["急診", "一般外科"],
          isEmergency: true
        } 
      },
    ],
  },
  head: {
    question: "頭痛/頭暈的狀況是？",
    options: [
      { 
        label: "突發劇烈頭痛（像被雷打到），或伴隨手腳無力", 
        result: { 
          title: "⚠️ 緊急狀況，請立即就醫", 
          advice: "突發性劇烈頭痛或單側無力可能是腦中風或腦出血前兆，請立即撥打 119 或直奔急診。", 
          departments: ["急診", "神經內科", "神經外科"],
          isEmergency: true
        } 
      },
      { 
        label: "長期反覆頭痛、偏頭痛", 
        result: { 
          title: "建議至神經內科", 
          advice: "慢性頭痛建議由神經內科醫師評估，找出誘發原因並開立合適的止痛或預防藥物。", 
          departments: ["神經內科", "家醫科"]
        } 
      },
    ],
  },
  chest: {
    question: "胸悶或喘的狀況是？",
    options: [
      { 
        label: "像被重物壓住、冒冷汗、痛到左肩", 
        result: { 
          title: "🚨 極度危險，請立即撥打 119", 
          advice: "這是典型的心肌梗塞前兆，請立刻停止活動，坐下休息並打 119 叫救護車，絕對不要自己開車。", 
          departments: ["急診", "心臟內科"],
          isEmergency: true
        } 
      },
      { 
        label: "運動或爬樓梯時才會喘", 
        result: { 
          title: "建議至心臟內科或胸腔內科", 
          advice: "活動性喘可能與心肺功能有關，建議至醫院安排心電圖或X光檢查。", 
          departments: ["心臟內科", "胸腔內科"]
        } 
      },
    ],
  },
  skin: {
    question: "皮膚的狀況是？",
    options: [
      { 
        label: "起紅疹、發癢，但沒有發燒", 
        result: { 
          title: "建議至皮膚科", 
          advice: "單純的紅疹發癢多為過敏、濕疹或黴菌感染，可至皮膚科診所由醫師開立藥膏。", 
          departments: ["皮膚科", "家醫科"]
        } 
      },
      { 
        label: "起紅疹且伴隨高燒、呼吸困難", 
        result: { 
          title: "⚠️ 請立即就醫", 
          advice: "伴隨發燒與呼吸困難的皮疹，可能是嚴重藥物過敏（如史蒂芬強森症候群）或嚴重感染，請直奔急診。", 
          departments: ["急診", "皮膚科", "感染科"],
          isEmergency: true
        } 
      },
    ],
  },
};

export default function AssistantPage() {
  const [currentStep, setCurrentStep] = useState<string | null>("start");
  const [history, setHistory] = useState<string[]>([]);

  const handleSelect = (option: any) => {
    if (option.nextStep) {
      setHistory([...history, currentStep!]);
      setCurrentStep(option.nextStep);
    } else if (option.result) {
      setHistory([...history, currentStep!]);
      setCurrentStep("result");
      // 暫存結果以供顯示
      sessionStorage.setItem("assistantResult", JSON.stringify(option.result));
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStep(prev);
    }
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentStep("start");
    sessionStorage.removeItem("assistantResult");
  };

  const currentData = currentStep && currentStep !== "result" ? flowData[currentStep] : null;
  const resultData = typeof window !== "undefined" && sessionStorage.getItem("assistantResult") 
    ? JSON.parse(sessionStorage.getItem("assistantResult")!) 
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/hospitals" className="text-neutral-500 hover:text-teal-700 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-neutral-500 hover:text-teal-700 transition-colors">診所查找</Link>
            <Link href="/tools/symptoms" className="text-neutral-500 hover:text-teal-700 transition-colors">症狀查科別</Link>
            <Link href="/tools/assistant" className="font-medium text-teal-700">醫療小幫手</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">醫療小幫手</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          互動式就醫指引
        </h1>
        <p className="text-neutral-600 leading-relaxed">
          透過簡單的點選，幫助您釐清症狀，並提供建議的就醫科別。本工具無法取代醫師診斷，若有不適請盡速就醫。
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 w-full flex-1">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-12 shadow-sm min-h-[400px] flex flex-col justify-center">
          
          {currentStep === "start" && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">您好，請問需要什麼協助？</h2>
              <p className="text-neutral-500">請選擇您目前最困擾的症狀</p>
            </div>
          )}

          {currentData && (
            <div>
              {currentStep !== "start" && (
                <button onClick={handleBack} className="text-sm text-neutral-400 hover:text-neutral-700 mb-6 flex items-center gap-1">
                  ← 返回上一步
                </button>
              )}
              <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 mb-6">
                {currentData.question}
              </h2>
              <div className="space-y-3">
                {currentData.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left px-6 py-4 rounded-xl border border-neutral-200 hover:border-teal-400 hover:bg-teal-50 transition-all font-medium text-neutral-700 hover:text-teal-900 group flex justify-between items-center"
                  >
                    <span>{opt.label}</span>
                    <span className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "result" && resultData && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              {resultData.isEmergency && (
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 text-3xl">
                  ⚠️
                </div>
              )}
              <h2 className={`text-2xl font-serif font-bold mb-4 ${resultData.isEmergency ? "text-red-600" : "text-teal-700"}`}>
                {resultData.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-8">
                {resultData.advice}
              </p>

              <div className="bg-neutral-50 rounded-xl p-4 mb-8 inline-block text-left border border-neutral-100">
                <p className="text-sm text-neutral-500 mb-2">建議掛號科別：</p>
                <div className="flex flex-wrap gap-2">
                  {resultData.departments.map((d: string) => (
                    <span key={d} className="inline-block px-3 py-1 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Link href="/hospitals" className="px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                  查詢醫院掛號
                </Link>
                <Link href="/clinics" className="px-6 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-full hover:bg-neutral-200 transition-colors border border-neutral-200">
                  尋找附近診所
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <button onClick={handleRestart} className="text-sm text-neutral-400 hover:text-neutral-700 underline underline-offset-4">
                  重新評估
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-neutral-500 text-center">
          <p className="mb-2">本工具僅供初步導航參考，無法取代專業醫師的診斷與治療。若症狀緊急，請立即撥打 119。</p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}