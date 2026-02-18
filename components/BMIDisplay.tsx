"use client";

// BMI表示コンポーネント

import type { BMICategory } from "@/lib/types";

interface BMIDisplayProps {
  bmi: number;
  bmiCategory: BMICategory;
}

// BMIカテゴリに対応するスタイル情報
const categoryStyles: Record<
  BMICategory,
  { bg: string; text: string; border: string; emoji: string }
> = {
  "低体重（痩せ）": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    emoji: "💙",
  },
  普通体重: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    emoji: "💚",
  },
  過体重: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    emoji: "💛",
  },
  肥満: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    emoji: "❤️",
  },
};

export default function BMIDisplay({ bmi, bmiCategory }: BMIDisplayProps) {
  const style = categoryStyles[bmiCategory];

  // BMIゲージのパーセント位置を計算（10〜40の範囲を0〜100%にマッピング）
  const minBMI = 10;
  const maxBMI = 40;
  const gaugePercent = Math.max(
    0,
    Math.min(100, ((bmi - minBMI) / (maxBMI - minBMI)) * 100)
  );

  return (
    <div className={`rounded-2xl border-2 ${style.border} ${style.bg} p-5`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 text-sm">現在のBMI</h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text} border ${style.border}`}
        >
          {style.emoji} {bmiCategory}
        </span>
      </div>

      {/* BMI値 */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-4xl font-bold ${style.text}`}>{bmi}</span>
        <span className="text-sm text-gray-500">/ BMI</span>
      </div>

      {/* BMIゲージ */}
      <div className="mb-2">
        {/* ゲージバー */}
        <div className="relative h-3 rounded-full overflow-hidden bg-gray-200 flex">
          {/* 各セクション */}
          <div className="bg-blue-400" style={{ width: "28.3%" }} /> {/* 〜18.5 */}
          <div className="bg-green-500" style={{ width: "21.7%" }} /> {/* 18.5〜25 */}
          <div className="bg-yellow-400" style={{ width: "16.7%" }} /> {/* 25〜30 */}
          <div className="bg-red-400" style={{ width: "33.3%" }} /> {/* 30〜40 */}

          {/* 現在地インジケーター */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-800 shadow-sm"
            style={{ left: `${gaugePercent}%` }}
          />
        </div>

        {/* ラベル */}
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>10</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40+</span>
        </div>
      </div>

      {/* カテゴリ説明 */}
      <p className="text-xs text-gray-500 mt-3">
        {bmiCategory === "低体重（痩せ）" &&
          "BMI 18.5未満は低体重とされています。適切な栄養摂取を心がけましょう。"}
        {bmiCategory === "普通体重" &&
          "BMI 18.5〜24.9は健康的な体重範囲とされています。"}
        {bmiCategory === "過体重" &&
          "BMI 25〜29.9は過体重の範囲です。生活習慣の見直しを検討してみましょう。"}
        {bmiCategory === "肥満" &&
          "BMI 30以上は肥満の範囲です。専門家への相談もご検討ください。"}
      </p>
    </div>
  );
}
