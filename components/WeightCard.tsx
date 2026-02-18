"use client";

// 体重カードコンポーネント（各体重タイプを表示）

import type { WeightCardInfo } from "@/lib/types";

interface WeightCardProps {
  info: WeightCardInfo;
  currentWeight?: number | null;
  // 差分表示用（現在体重が入力されている場合）
  diff?: number | null;
  achievementRate?: number | null;
}

export default function WeightCard({
  info,
  currentWeight,
  diff,
  achievementRate,
}: WeightCardProps) {
  const { label, weight, description, color, bmiValue } = info;

  // 差分の表示テキスト生成
  const getDiffText = () => {
    if (diff === null || diff === undefined) return null;
    if (diff === 0) return "達成済み！";
    if (diff > 0) return `あと ${diff}kg`;
    return `${Math.abs(diff)}kg 超過`;
  };

  // 達成済みかどうか
  const isAchieved = diff !== null && diff !== undefined && diff <= 0;

  const diffText = getDiffText();

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${
        isAchieved ? "ring-2 ring-green-400" : ""
      }`}
    >
      {/* カラーアクセントバー */}
      <div className={`h-1.5 ${color}`} />

      <div className="p-4">
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">{label}</span>
          {isAchieved && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              ✓ 達成済み
            </span>
          )}
        </div>

        {/* メイン体重表示 */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold text-gray-800">{weight}</span>
          <span className="text-base text-gray-500 font-medium">kg</span>
        </div>

        {/* BMI基準値 */}
        <p className="text-xs text-gray-400 mb-2">BMI {bmiValue}</p>

        {/* 一言説明 */}
        <p className="text-xs text-gray-500">{description}</p>

        {/* 現在体重との差分（入力されている場合） */}
        {currentWeight !== null &&
          currentWeight !== undefined &&
          diffText !== null && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {/* 差分テキスト */}
              <div
                className={`text-sm font-semibold mb-2 ${
                  isAchieved ? "text-green-600" : "text-gray-700"
                }`}
              >
                {diffText}
              </div>

              {/* 達成率プログレスバー */}
              {achievementRate !== null && achievementRate !== undefined && (
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>達成率</span>
                    <span>{achievementRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isAchieved
                          ? "bg-green-500"
                          : achievementRate >= 70
                          ? "bg-emerald-400"
                          : achievementRate >= 40
                          ? "bg-yellow-400"
                          : "bg-orange-400"
                      }`}
                      style={{ width: `${Math.min(100, achievementRate)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
