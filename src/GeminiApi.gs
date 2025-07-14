// GeminiApi.gs

// スクリプトプロパティからAPIキーを取得
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

// Gemini APIのエンドポイント
// 修正: APIキーをURLから削除し、ヘッダーで渡すように変更します。
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// もし gemini-2.0-flash も利用できない場合、gemini-1.0-pro を試すか、
// Google AI Studioで利用可能なモデルを確認してください。
// const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent";


/**
 * Gemini APIにプロンプトを送信し、その結果を取得します。
 * @param {string} promptText - Gemini APIに送信するプロンプト。
 * @returns {string} Gemini APIからの生のテキストレスポンス。
 */
function callGeminiApi(promptText) {
  if (!GEMINI_API_KEY) {
    throw new Error("APIキーがスクリプトプロパティに設定されていません。'GEMINI_API_KEY'を確認してください。");
  }

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: promptText
      }]
    }],
    // 必要に応じて generationConfig を追加できます
    // generationConfig: {
    //   temperature: 0.7,
    //   topP: 0.95,
    //   topK: 40,
    //   maxOutputTokens: 1024,
    // },
  });

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true, // エラーレスポンスも取得するため
    // 修正: APIキーをHTTPヘッダーとして追加します。
    headers: {
      'X-goog-api-key': GEMINI_API_KEY
    }
  };

  try {
    const response = UrlFetchApp.fetch(GEMINI_API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
      // APIからのエラーレスポンスを解析して詳細なメッセージを返す
      let errorMessage = `APIエラー: HTTPステータス ${responseCode}.`;
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.error && errorJson.error.message) {
          errorMessage += ` レスポンス: ${errorJson.error.message}`;
        } else {
          errorMessage += ` レスポンス: ${responseText}`;
        }
      } catch (e) {
        errorMessage += ` レスポンス: ${responseText}`; // JSONパース失敗時
      }
      throw new Error(errorMessage);
    }

    const result = JSON.parse(responseText);

    // 生成されたテキストを抽出
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Gemini APIからのレスポンスに生成されたテキストが含まれていません。");
    }
  } catch (e) {
    // UrlFetchApp自体のエラーや、上記でスローされたエラーをキャッチ
    throw new Error("Gemini API呼び出し中にエラーが発生しました: " + e.message);
  }
}
