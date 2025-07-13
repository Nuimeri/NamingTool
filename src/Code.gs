/**
 * @file Webアプリのエントリポイントと、クライアントから呼び出されるグローバル関数を定義します。
 */

/**
 * WebブラウザからのGETリクエストを処理し、メインのHTMLページを返します。
 * @param {Object} e - イベントオブジェクト
 * @returns {HtmlOutput} HTMLサービスのアウトプット
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('AIネーミングアシスタント');
}

/**
 * フロントエンドから呼び出されるネーミング生成のメイン関数。
 * @param {string} keyword - ユーザーが入力したキーワード。
 * @returns {string[]} 生成されたネーミング案の配列。
 * @throws {Error} 処理中にエラーが発生した場合。
 */
function generateNaming(keyword) {
  try {
    const prompt = generatePrompt(keyword);
    const apiResponse = callGeminiApi(prompt);
    const names = parseApiResponse(apiResponse);
    return names;
  } catch (e) {
    throw new Error(`ネーミングの生成に失敗しました: ${e.message}`);
  }
}