/**
 * @file Gemini APIとの連携を担当します。
 */

/**
 * Gemini APIにプロンプトを送信し、その結果を取得します。
 * @param {string} promptText - Gemini APIに送信するプロンプト。
 * @returns {string} Gemini APIからの生のテキストレスポンス。
 * @throws {Error} APIキーの未設定、API呼び出しの失敗、レスポンスの解析失敗時にエラーをスローします。
 */
function callGeminiApi(promptText) {
  const API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!API_KEY) {
    throw new Error("Gemini APIキーが設定されていません。");
  }

  const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY;

  const payload = {
    contents: [{
      parts: [{
        text: promptText
      }]
    }],
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // APIからのエラーレスポンスも取得するため
  };

  const response = UrlFetchApp.fetch(API_ENDPOINT, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode !== 200) {
    throw new Error(`APIエラー: HTTPステータス ${responseCode}. レスポンス: ${responseBody}`);
  }

  try {
    const jsonResponse = JSON.parse(responseBody);
    const text = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    }
    throw new Error("レスポンスからテキストを抽出できませんでした。");
  } catch (e) {
    throw new Error(`レスポンスの解析に失敗しました: ${e.message}. レスポンス: ${responseBody}`);
  }
}