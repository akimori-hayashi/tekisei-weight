"use client";

// 入力フォームコンポーネント

import { useState } from "react";
import type { FormValues, Gender } from "@/lib/types";

interface InputFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  // フォームの状態管理
  const [gender, setGender] = useState<Gender>("女性");
  const [age, setAge] = useState<number>(25);
  const [height, setHeight] = useState<number>(160);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState<string>("");

  // 年齢の選択肢（10〜100歳）
  const ageOptions = Array.from({ length: 91 }, (_, i) => i + 10);

  // 身長の選択肢（100〜230cm）
  const heightOptions = Array.from({ length: 131 }, (_, i) => i + 100);

  // 体重の選択肢（30〜200kg）
  const weightOptions = Array.from({ length: 171 }, (_, i) => i + 30);

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      gender,
      age,
      height,
      currentWeight,
    });
  };

  // 体重選択の変更ハンドラ
  const handleWeightChange = (value: string) => {
    setWeightInput(value);
    if (value === "") {
      setCurrentWeight(null);
    } else {
      setCurrentWeight(Number(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 性別選択 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          性別 <span className="text-green-600">*</span>
        </label>
        <div className="flex gap-3">
          {(["女性", "男性"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                gender === g
                  ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"
              }`}
            >
              {g === "女性" ? "👩 女性" : "👨 男性"}
            </button>
          ))}
        </div>
      </div>

      {/* 年齢選択 */}
      <div>
        <label
          htmlFor="age"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          年齢 <span className="text-green-600">*</span>
        </label>
        <div className="relative">
          <select
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full py-3 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none focus:border-green-500 transition-colors duration-200"
          >
            {ageOptions.map((a) => (
              <option key={a} value={a}>
                {a}歳
              </option>
            ))}
          </select>
          {/* カスタム矢印アイコン */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 身長選択 */}
      <div>
        <label
          htmlFor="height"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          身長 <span className="text-green-600">*</span>
        </label>
        <div className="relative">
          <select
            id="height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full py-3 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none focus:border-green-500 transition-colors duration-200"
          >
            {heightOptions.map((h) => (
              <option key={h} value={h}>
                {h}cm
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 現在の体重選択（任意） */}
      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          現在の体重{" "}
          <span className="text-gray-400 font-normal text-xs">（任意）</span>
        </label>
        <div className="relative">
          <select
            id="weight"
            value={weightInput}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full py-3 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none focus:border-green-500 transition-colors duration-200"
          >
            <option value="">入力しない</option>
            {weightOptions.map((w) => (
              <option key={w} value={w}>
                {w}kg
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          入力すると目標との差分やBMIが表示されます
        </p>
      </div>

      {/* プライバシー注記 */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        入力内容は保存・送信されません
      </p>

      {/* 診断ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 shadow-md ${
          isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-98"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            計算中...
          </span>
        ) : (
          "✨ 体型を診断する"
        )}
      </button>
    </form>
  );
}
