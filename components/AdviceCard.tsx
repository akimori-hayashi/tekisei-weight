"use client";

// AIアドバイスカードコンポーネント

interface AdviceCardProps {
  advice: string;
  isLoading: boolean;
  error: string | null;
}

export default function AdviceCard({
  advice,
  isLoading,
  error,
}: AdviceCardProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-green-200 p-5">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <h3 className="font-bold text-gray-700">AIからのアドバイス</h3>
        <span className="text-xs text-gray-400 font-normal ml-auto">Powered by Claude</span>
      </div>

      {/* ローディングスピナー */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-3 text-green-600">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm font-medium">アドバイスを生成中...</span>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && !isLoading && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* アドバイステキスト（ストリーミング表示） */}
      {!isLoading && !error && advice && (
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {advice}
        </div>
      )}

      {/* 免責表示 */}
      {!isLoading && (advice || error) && (
        <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-green-100">
          ※ このアドバイスは参考情報です。医療的な診断ではありません。
        </p>
      )}
    </div>
  );
}
