# 適正体重計算ツール

性別・年齢・身長を入力するだけで、標準体重・美容体重・モデル体重・シンデレラ体重を一覧表示し、現在体重との差分・達成率・BMI判定も確認できるWebアプリです。AIアドバイスはClaude APIを使ってリアルタイムに生成します。

## 機能

- **4種類の目標体重を即時計算**
  - 標準体重（BMI = 22）
  - 美容体重（BMI = 20）
  - モデル体重（BMI = 18）
  - シンデレラ体重（BMI = 17.6 / 女性のみ）
- **現在体重との比較**（任意入力）
  - 各目標との差分表示
  - 達成率プログレスバー
  - 現在のBMI値とカテゴリ判定（低体重・普通・過体重・肥満）
- **Claude APIによるAIアドバイス**（ストリーミング表示）
- **Xシェア機能**（診断結果をXに投稿）

## 技術スタック

- [Next.js 16](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS v4
- [Anthropic Claude API](https://docs.anthropic.com/) (`claude-sonnet-4-5`)

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、Claude APIキーを設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

APIキーは [Anthropic Console](https://console.anthropic.com/) から取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## ディレクトリ構成

```
├── app/
│   ├── api/advice/route.ts   # Claude API ストリーミングルート（POST）
│   ├── globals.css           # グローバルスタイル
│   ├── layout.tsx            # SEO・OGP メタデータ
│   └── page.tsx              # メインページ
├── components/
│   ├── InputForm.tsx         # 入力フォーム
│   ├── WeightCard.tsx        # 体重カード（差分・達成率表示）
│   ├── BMIDisplay.tsx        # BMIゲージと判定
│   ├── AdviceCard.tsx        # AIアドバイス表示
│   ├── ResultsSection.tsx    # 結果セクション統合
│   └── ShareButton.tsx       # Xシェアボタン
├── lib/
│   ├── types.ts              # TypeScript型定義
│   └── calculations.ts      # 体重・BMI計算ロジック
└── .env.local.example        # 環境変数設定例
```

## Vercelへのデプロイ

1. [Vercel](https://vercel.com/) にリポジトリを連携
2. Vercel の **Environment Variables** に `ANTHROPIC_API_KEY` を設定
3. デプロイ実行

## セキュリティについて

- `ANTHROPIC_API_KEY` は必ずサーバーサイド（`.env.local`）で管理し、クライアントには絶対に公開しないでください
- APIルート (`/api/advice`) でのみAPIキーを使用しています
- レート制限：1セッションあたり10回の呼び出しに制限

## 注意事項

本ツールの計算結果は一般的な指標に基づくものであり、医療的な診断ではありません。健康に関する判断は医療専門家にご相談ください。
