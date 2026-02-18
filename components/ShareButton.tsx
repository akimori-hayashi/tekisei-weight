"use client";

// Xシェアボタンコンポーネント

import type { Gender, BMICategory } from "@/lib/types";

interface ShareButtonProps {
  gender: Gender;
  height: number;
  standardWeight: number;
  beautyWeight: number;
  modelWeight: number;
  currentWeight?: number | null;
  bmi?: number | null;
  bmiCategory?: BMICategory | null;
  diffStandard?: number | null;
  diffBeauty?: number | null;
}

// Xシェア用URLを生成する関数
const generateShareURL = (text: string): string => {
  const encodedText = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${encodedText}`;
};

export default function ShareButton({
  gender,
  height,
  standardWeight,
  beautyWeight,
  modelWeight,
  currentWeight,
  bmi,
  bmiCategory,
  diffStandard,
  diffBeauty,
}: ShareButtonProps) {
  // サイトURL（本番環境では環境変数から取得するのが望ましい）
  const siteURL =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://tekisei-weight.vercel.app";

  // シェアテキストの生成
  const generateShareText = (): string => {
    if (currentWeight && bmi && bmiCategory) {
      // 現在の体重あり の場合
      const diffStandardText =
        diffStandard !== null && diffStandard !== undefined
          ? diffStandard > 0
            ? `-${diffStandard}`
            : `+${Math.abs(diffStandard)}`
          : "";
      const diffBeautyText =
        diffBeauty !== null && diffBeauty !== undefined
          ? diffBeauty > 0
            ? `-${diffBeauty}`
            : `+${Math.abs(diffBeauty)}`
          : "";

      return `身長${height}cm・${gender}の私の体型診断結果✨

📊 現在のBMI：${bmi}（${bmiCategory}）
⚖️ 標準体重：${standardWeight}kg（あと${diffStandardText}kg）
💚 美容体重：${beautyWeight}kg（あと${diffBeautyText}kg）
✨ モデル体重：${modelWeight}kg

あなたも診断してみて👇
${siteURL}

#適正体重 #体型診断 #BMI`;
    } else {
      // 現在の体重なし の場合
      return `身長${height}cmの目標体重を調べてみた✨

⚖️ 標準体重：${standardWeight}kg
💚 美容体重：${beautyWeight}kg
✨ モデル体重：${modelWeight}kg

あなたも診断してみて👇
${siteURL}

#適正体重 #体型診断 #BMI`;
    }
  };

  // ボタンクリックハンドラ
  const handleShare = () => {
    const shareText = generateShareText();
    const url = generateShareURL(shareText);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
    >
      {/* X（旧Twitter）ロゴSVG */}
      <svg
        className="w-4 h-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
      結果をXでシェアする
    </button>
  );
}
