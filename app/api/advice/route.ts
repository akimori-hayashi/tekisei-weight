// Claude APIを使ったAIアドバイス生成のAPIルート

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import type { AdviceRequest } from "@/lib/types";

// 1セッションあたりの最大呼び出し回数
const MAX_CALLS_PER_SESSION = 10;

// セッションごとの呼び出し回数管理（インメモリ、サーバー再起動でリセット）
const sessionCallCount = new Map<string, number>();

// Anthropic クライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // セッションIDをIPアドレスで代用（本番では適切なセッション管理を推奨）
    const sessionId =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    // レート制限チェック
    const currentCount = sessionCallCount.get(sessionId) || 0;
    if (currentCount >= MAX_CALLS_PER_SESSION) {
      return new Response(
        JSON.stringify({
          error:
            "1セッションあたりの利用制限（10回）に達しました。しばらくしてから再度お試しください。",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // リクエストボディを解析
    const body: AdviceRequest = await request.json();
    const {
      gender,
      age,
      height,
      currentWeight,
      standardWeight,
      beautyWeight,
      bmi,
      bmiCategory,
    } = body;

    // 差分の計算
    const diffStandard = Math.round((standardWeight - currentWeight) * 10) / 10;
    const diffBeauty = Math.round((beautyWeight - currentWeight) * 10) / 10;

    // ユーザープロンプトの動的生成
    const userPrompt = `性別：${gender}、年齢：${age}歳、身長：${height}cm、
現在体重：${currentWeight}kg、BMI：${bmi}（${bmiCategory}）
標準体重まで${diffStandard}kg、美容体重まで${diffBeauty}kg
この方へのアドバイスをお願いします。`;

    // 呼び出し回数をインクリメント
    sessionCallCount.set(sessionId, currentCount + 1);

    // Claude APIへのストリーミングリクエスト
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: `あなたは健康・体型に関する親切なアドバイザーです。
ユーザーの体型データをもとに、励ましと具体的なアドバイスを提供してください。
必ず以下の構成で200文字以内の日本語で返答してください。
- 現在の体型への肯定的なコメント
- 目標体重に向けた現実的なアドバイス1つ
- 最後に励ましの一言
医療的な診断は行わず、あくまで参考情報として伝えること。`,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // ストリーミングレスポンスを返す
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              // テキストデルタをSSE形式で送信
              const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          // ストリーム終了を通知
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AIアドバイス生成エラー:", error);
    return new Response(
      JSON.stringify({
        error: "アドバイスを取得できませんでした。再度お試しください。",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
