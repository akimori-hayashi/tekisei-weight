"use client";

// 結果表示セクションコンポーネント

import { useCallback, useEffect, useRef, useState } from "react";
import WeightCard from "./WeightCard";
import BMIDisplay from "./BMIDisplay";
import AdviceCard from "./AdviceCard";
import ShareButton from "./ShareButton";
import { calcDiff, calcAchievementRate } from "@/lib/calculations";
import type { FormValues, WeightResults, WeightCardInfo, AdviceRequest } from "@/lib/types";

interface ResultsSectionProps {
  formValues: FormValues;
  results: WeightResults;
}

export default function ResultsSection({
  formValues,
  results,
}: ResultsSectionProps) {
  const { gender, age, height, currentWeight } = formValues;
  const {
    standardWeight,
    beautyWeight,
    modelWeight,
    cinderellaWeight,
    bmi,
    bmiCategory,
  } = results;

  // AIアドバイスの状態管理
  const [advice, setAdvice] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState<boolean>(false);
  const adviceFetchedRef = useRef<boolean>(false);

  // 体重カード情報の定義
  const weightCards: WeightCardInfo[] = [
    {
      label: "標準体重",
      weight: standardWeight,
      description: "健康的とされる基準体重です（BMI 22）",
      color: "bg-green-500",
      bmiValue: 22,
    },
    {
      label: "美容体重",
      weight: beautyWeight,
      description: "美しいスタイルとされる体重です（BMI 20）",
      color: "bg-emerald-400",
      bmiValue: 20,
    },
    {
      label: "モデル体重",
      weight: modelWeight,
      description: "モデル体型の基準とされる体重です（BMI 18）",
      color: "bg-teal-400",
      bmiValue: 18,
    },
    ...(cinderellaWeight !== null
      ? [
          {
            label: "シンデレラ体重",
            weight: cinderellaWeight,
            description: "SNSで話題の体重の基準です（BMI 17.6）",
            color: "bg-pink-400",
            bmiValue: 17.6,
          },
        ]
      : []),
  ];

  // 現在体重との差分計算
  const getDiff = (targetWeight: number) => {
    if (currentWeight === null) return null;
    return calcDiff(currentWeight, targetWeight);
  };

  // 達成率計算（基準は現在体重 + 5kg の余裕を持たせる）
  const getRate = (targetWeight: number) => {
    if (currentWeight === null) return null;
    const baseWeight = Math.max(currentWeight, targetWeight + 10);
    return calcAchievementRate(currentWeight, targetWeight, baseWeight);
  };

  // AIアドバイスを取得する関数（現在体重入力時のみ）
  const fetchAdvice = useCallback(async () => {
    if (!currentWeight || !bmi || !bmiCategory) return;

    setIsLoadingAdvice(true);
    setAdviceError(null);
    setAdvice("");
    setShowShare(false);

    const requestBody: AdviceRequest = {
      gender,
      age,
      height,
      currentWeight,
      standardWeight,
      beautyWeight,
      modelWeight,
      cinderellaWeight,
      bmi,
      bmiCategory,
    };

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "アドバイスを取得できませんでした。"
        );
      }

      // ストリーミングレスポンスを処理
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("ストリームの読み取りに失敗しました。");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              setIsLoadingAdvice(false);
              setShowShare(true);
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setAdvice((prev) => prev + parsed.text);
              }
            } catch {
              // JSONパースエラーは無視
            }
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "アドバイスを取得できませんでした。再度お試しください。";
      setAdviceError(errorMessage);
      setShowShare(true);
    } finally {
      setIsLoadingAdvice(false);
    }
  }, [
    currentWeight,
    bmi,
    bmiCategory,
    gender,
    age,
    height,
    standardWeight,
    beautyWeight,
    modelWeight,
    cinderellaWeight,
  ]);

  // 結果が表示されたらAIアドバイスを自動取得（現在体重がある場合）
  useEffect(() => {
    if (!adviceFetchedRef.current && currentWeight && bmi && bmiCategory) {
      adviceFetchedRef.current = true;
      fetchAdvice();
    } else if (!currentWeight) {
      // 体重未入力の場合はシェアボタンをすぐ表示
      setShowShare(true);
    }
  }, [currentWeight, bmi, bmiCategory, fetchAdvice]);

  return (
    <div className="space-y-6">
      {/* セクションヘッダー */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <h2 className="text-sm font-semibold text-gray-500 whitespace-nowrap">
          診断結果
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* 入力内容サマリ */}
      <div className="bg-gray-50 rounded-xl p-3 flex flex-wrap gap-2">
        {[
          { label: "性別", value: gender },
          { label: "年齢", value: `${age}歳` },
          { label: "身長", value: `${height}cm` },
          ...(currentWeight
            ? [{ label: "体重", value: `${currentWeight}kg` }]
            : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="text-xs text-gray-400">{label}:</span>
            <span className="text-xs font-semibold text-gray-700">{value}</span>
          </div>
        ))}
      </div>

      {/* BMI表示（現在体重入力時） */}
      {bmi !== null && bmiCategory !== null && (
        <BMIDisplay bmi={bmi} bmiCategory={bmiCategory} />
      )}

      {/* 体重カード一覧 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          目標体重一覧
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {weightCards.map((card) => {
            const diff = getDiff(card.weight);
            const rate = getRate(card.weight);
            return (
              <WeightCard
                key={card.label}
                info={card}
                currentWeight={currentWeight}
                diff={diff}
                achievementRate={rate}
              />
            );
          })}
        </div>
      </div>

      {/* AIアドバイスカード（現在体重入力時） */}
      {currentWeight && (
        <div>
          <AdviceCard
            advice={advice}
            isLoading={isLoadingAdvice}
            error={adviceError}
          />
          {/* 再取得ボタン */}
          {!isLoadingAdvice && (advice || adviceError) && (
            <button
              onClick={() => {
                adviceFetchedRef.current = false;
                fetchAdvice();
              }}
              className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              アドバイスを再生成する
            </button>
          )}
        </div>
      )}

      {/* Xシェアボタン */}
      {showShare && (
        <ShareButton
          gender={gender}
          height={height}
          standardWeight={standardWeight}
          beautyWeight={beautyWeight}
          modelWeight={modelWeight}
          currentWeight={currentWeight}
          bmi={bmi}
          bmiCategory={bmiCategory}
          diffStandard={
            currentWeight ? getDiff(standardWeight) : null
          }
          diffBeauty={
            currentWeight ? getDiff(beautyWeight) : null
          }
        />
      )}
    </div>
  );
}
