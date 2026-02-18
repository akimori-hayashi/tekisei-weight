"use client";

// メインページ - 適正体重計算ツール

import { useRef, useState } from "react";
import InputForm from "@/components/InputForm";
import ResultsSection from "@/components/ResultsSection";
import { calculateAllWeights } from "@/lib/calculations";
import type { FormValues, WeightResults } from "@/lib/types";

export default function Home() {
  // 診断結果の状態管理
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [results, setResults] = useState<WeightResults | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // 結果セクションへのスクロール用ref
  const resultsRef = useRef<HTMLDivElement>(null);

  // フォーム送信ハンドラ
  const handleFormSubmit = async (values: FormValues) => {
    setIsCalculating(true);

    // 体重計算を実行
    const calculatedResults = calculateAllWeights(
      values.height,
      values.gender,
      values.currentWeight
    );

    setFormValues(values);
    setResults(calculatedResults);
    setIsCalculating(false);

    // 結果セクションへスムーズスクロール
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="font-bold text-green-700 text-sm">
            適正体重計算ツール
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-16">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            あなたの目標体重を診断
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            性別・年齢・身長を入力するだけで
            <br />
            標準体重・美容体重・モデル体重を即時計算
          </p>
        </div>

        {/* 入力フォームカード */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-bold text-gray-700 mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            基本情報を入力
          </h2>
          <InputForm onSubmit={handleFormSubmit} isLoading={isCalculating} />
        </div>

        {/* 結果セクション */}
        {results && formValues && (
          <div ref={resultsRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-700 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              診断結果
            </h2>
            <ResultsSection formValues={formValues} results={results} />
          </div>
        )}

        {/* 特徴説明（結果がない場合） */}
        {!results && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              {
                icon: "🔒",
                title: "データ保存なし",
                desc: "入力内容は保存されません",
              },
              {
                icon: "⚡",
                title: "即時計算",
                desc: "ボタン1つで結果を表示",
              },
              {
                icon: "🤖",
                title: "AIアドバイス",
                desc: "Claude AIが体型に応じた提案",
              },
              {
                icon: "📊",
                title: "4種類の体重",
                desc: "標準・美容・モデル・シンデレラ",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {title}
                </div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-lg mx-auto px-4 text-center space-y-3">
          {/* 内部リンク */}
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            BMI計算ツールはこちら
          </a>

          <div className="text-xs text-gray-400 space-y-1">
            <p>
              ※ 本ツールの計算結果は一般的な指標に基づくもので、
              <br />
              医療的な診断ではありません。
            </p>
            <p>
              © 2024 適正体重計算ツール
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
