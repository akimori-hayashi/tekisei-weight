// ルートレイアウト - メタデータとグローバルスタイルを設定

import type { Metadata } from "next";
import "./globals.css";

// SEOメタデータの設定
export const metadata: Metadata = {
  title: "適正体重計算ツール｜標準体重・美容体重・モデル体重を無料診断",
  description:
    "身長・性別を入力するだけで標準体重・美容体重・モデル体重・シンデレラ体重を即時計算。AIが体型に合ったアドバイスも提供。登録不要・データ保存なし。",
  keywords: [
    "適正体重",
    "標準体重",
    "美容体重",
    "モデル体重",
    "シンデレラ体重",
    "BMI計算",
    "体重計算",
    "目標体重",
  ],
  authors: [{ name: "適正体重計算ツール" }],
  // OGP設定
  openGraph: {
    title: "適正体重計算ツール｜標準体重・美容体重・モデル体重を無料診断",
    description:
      "身長・性別を入力するだけで標準体重・美容体重・モデル体重・シンデレラ体重を即時計算。AIが体型に合ったアドバイスも提供。",
    type: "website",
    locale: "ja_JP",
    siteName: "適正体重計算ツール",
  },
  // Twitterカード設定
  twitter: {
    card: "summary",
    title: "適正体重計算ツール｜標準体重・美容体重・モデル体重を無料診断",
    description:
      "身長・性別を入力するだけで標準体重・美容体重・モデル体重・シンデレラ体重を即時計算。AIが体型に合ったアドバイスも提供。",
  },
  // インデックス許可
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
