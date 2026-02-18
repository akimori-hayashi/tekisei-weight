// 体重計算に使用する型定義

/** 性別の型 */
export type Gender = "男性" | "女性";

/** BMIカテゴリの型 */
export type BMICategory = "低体重（痩せ）" | "普通体重" | "過体重" | "肥満";

/** フォーム入力値の型 */
export interface FormValues {
  gender: Gender;
  age: number;
  height: number; // cm
  currentWeight: number | null; // kg（任意）
}

/** 体重計算結果の型 */
export interface WeightResults {
  standardWeight: number; // 標準体重（BMI=22）
  beautyWeight: number; // 美容体重（BMI=20）
  modelWeight: number; // モデル体重（BMI=18）
  cinderellaWeight: number | null; // シンデレラ体重（女性のみ、BMI=17.6）
  bmi: number | null; // 現在のBMI（体重入力時のみ）
  bmiCategory: BMICategory | null; // BMI判定（体重入力時のみ）
}

/** AIアドバイスAPIリクエストの型 */
export interface AdviceRequest {
  gender: Gender;
  age: number;
  height: number;
  currentWeight: number;
  standardWeight: number;
  beautyWeight: number;
  modelWeight: number;
  cinderellaWeight: number | null;
  bmi: number;
  bmiCategory: BMICategory;
}

/** 各体重タイプの表示情報 */
export interface WeightCardInfo {
  label: string; // 体重タイプ名
  weight: number; // 体重（kg）
  description: string; // 一言説明
  color: string; // カードのアクセントカラー（Tailwindクラス）
  bmiValue: number; // 基準BMI値
}
