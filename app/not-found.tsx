import Link from "next/link";
import { Header } from "./components/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-5xl mb-8">
          🩺
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          404 - 找不到這個頁面
        </h1>
        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          您要找的網頁可能已經被移除、更名，或是暫時無法使用。您可以回到首頁，或透過下方的導航重新尋找醫療資源。
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors shadow-sm"
          >
            回到首頁
          </Link>
          <Link 
            href="/clinics" 
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-medium rounded-full hover:bg-slate-50 transition-colors"
          >
            院所查詢
          </Link>
          <Link 
            href="/tools/symptoms" 
            className="px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium rounded-full hover:bg-indigo-100 transition-colors"
          >
            症狀查科別
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}