// 体重計算ロジック

import type { Gender, WeightResults, BMICategory } from "./types";

/**
 * 身長（cm）からメートルに変換する
 */
const cmToM = (heightCm: number): number => heightCm / 100;

/**
 * 標準体重を計算する（BMI = 22）
 * 標準体重 = 身長(m) × 身長(m) × 22
 */
export const calcStandardWeight = (heightCm: number): number => {
  const h = cmToM(heightCm);
  return Math.round(h * h * 22 * 10) / 10;
};

/**
 * 美容体重を計算する（BMI = 20）
 * 美容体重 = 身長(m) × 身長(m) × 20
 */
export const calcBeautyWeight = (heightCm: number): number => {
  const h = cmToM(heightCm);
  return Math.round(h * h * 20 * 10) / 10;
};

/**
 * モデル体重を計算する（BMI = 18）
 * モデル体重 = 身長(m) × 身長(m) × 18
 */
export const calcModelWeight = (heightCm: number): number => {
  const h = cmToM(heightCm);
  return Math.round(h * h * 18 * 10) / 10;
};

/**
 * シンデレラ体重を計算する（女性のみ、BMI = 17.6）
 * シンデレラ体重 = 身長(m) × 身長(m) × 17.6
 */
export const calcCinderellaWeight = (
  heightCm: number,
  gender: Gender
): number | null => {
  if (gender !== "女性") return null;
  const h = cmToM(heightCm);
  return Math.round(h * h * 17.6 * 10) / 10;
};

/**
 * BMIを計算する
 * BMI = 体重(kg) ÷ 身長(m)²
 */
export const calcBMI = (weightKg: number, heightCm: number): number => {
  const h = cmToM(heightCm);
  return Math.round((weightKg / (h * h)) * 10) / 10;
};

/**
 * BMI値からカテゴリを判定する
 * 18.5未満：低体重（痩せ）
 * 18.5〜25未満：普通体重
 * 25〜30未満：過体重
 * 30以上：肥満
 */
export const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return "低体重（痩せ）";
  if (bmi < 25) return "普通体重";
  if (bmi < 30) return "過体重";
  return "肥満";
};

/**
 * すべての体重計算を実行してまとめて返す
 */
export const calculateAllWeights = (
  heightCm: number,
  gender: Gender,
  currentWeight: number | null
): WeightResults => {
  const standardWeight = calcStandardWeight(heightCm);
  const beautyWeight = calcBeautyWeight(heightCm);
  const modelWeight = calcModelWeight(heightCm);
  const cinderellaWeight = calcCinderellaWeight(heightCm, gender);

  let bmi: number | null = null;
  let bmiCategory: BMICategory | null = null;

  if (currentWeight !== null) {
    bmi = calcBMI(currentWeight, heightCm);
    bmiCategory = getBMICategory(bmi);
  }

  return {
    standardWeight,
    beautyWeight,
    modelWeight,
    cinderellaWeight,
    bmi,
    bmiCategory,
  };
};

/**
 * 差分を計算して表示用文字列を生成する
 * 例：「あと -3.2kg」
 */
export const calcDiff = (
  currentWeight: number,
  targetWeight: number
): number => {
  return Math.round((targetWeight - currentWeight) * 10) / 10;
};

/**
 * 達成率をパーセントで計算する
 * 現在体重が目標体重以上の場合を0%、目標体重が達成済みなら100%とする
 */
export const calcAchievementRate = (
  currentWeight: number,
  targetWeight: number,
  baseWeight: number // 計算の基準となる最大値（例：入力時の体重）
): number => {
  if (currentWeight <= targetWeight) return 100;
  if (baseWeight <= targetWeight) return 100;
  const rate =
    ((baseWeight - currentWeight) / (baseWeight - targetWeight)) * 100;
  // 0〜100の範囲にクランプ
  return Math.max(0, Math.min(100, Math.round(rate)));
};
